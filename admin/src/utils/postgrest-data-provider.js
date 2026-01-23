import { HttpError, fetchUtils } from "react-admin";
import json2ParseBigint from "./json_parse_bigint";

// NOTE: The current perms token (and refresh) is used when we are talking directly to PostgREST over a tunnel.
// The current auth token, if set, is used when we're talking to reticulum proxying PostgREST.

// Custom fetchJson routing to ensure bigint precision
const fetchJson = (url, options) => {
  const requestHeaders =
    options.headers ||
    new Headers({
      Accept: "application/json"
    });
  if (!requestHeaders.has("Content-Type") && !(options && options.body && options.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  return fetch(url, { ...options, headers: requestHeaders })
    .then(response =>
      response.text().then(text => ({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: text
      }))
    )
    .then(({ status, statusText, headers, body }) => {
      let json;
      try {
        json = json2ParseBigint(body);
      } catch (e) {
        // not json
        console.warn(e);
      }

      if (status < 200 || status >= 300) {
        const error = new HttpError((json && json.message) || statusText, status, json);
        console.error("HTTP Error in data provider:", {
          status,
          statusText,
          message: (json && json.message) || statusText,
          response: json,
          errorMessage: error.message || error.toString(),
          stack: error.stack
        });
        throw error;
      }

      return { status, headers, body, json };
    });
};

const postgrestClient = (apiUrl, httpClient = fetchJson) => {
  const options = {};
  options.headers = new Headers();
  options.headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`);

  const stripReadOnlyColumns = json => {
    const newJson = {};

    for (const k of Object.keys(json)) {
      if (k.startsWith("_")) continue;
      newJson[k] = json[k];
    }

    return newJson;
  };

  const convertFilters = filters => {
    const rest = {};

    Object.keys(filters).map(function (key) {
      switch (typeof filters[key]) {
        case "string":
          rest[key] = "ilike.*" + filters[key].replace(/:/, "") + "*";
          break;

        case "boolean":
          rest[key] = "is." + filters[key];
          break;

        case "undefined":
          rest[key] = "is.null";
          break;

        case "number":
          rest[key] = "eq." + filters[key];
          break;

        case "object":
          if (filters[key].constructor === Array) {
            rest[key] = "cs.{" + filters[key].toString().replace(/:/, "") + "}";
          } else {
            Object.keys(filters[key]).map(val => (rest[`${key}->>${val}`] = `ilike.*${filters[key][val]}*`));
          }
          break;

        default:
          rest[key] = "ilike.*" + filters[key].toString().replace(/:/, "") + "*";
          break;
      }
    });
    return rest;
  };

  return {
    GetList: async (resource, { sort, pagination, filter }) => {
      const { page, perPage } = pagination;
      const { field, order } = sort;
      options.headers.set("Range-Unit", "items");
      options.headers.set("Prefer", "count=exact");

      const query = {
        order: field + "." + order.toLowerCase(),
        offset: (page - 1) * perPage,
        limit: perPage
      };
      Object.assign(query, convertFilters(filter));

      const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
      const { headers, json } = await httpClient(url, options);

      const maxInPage = parseInt(headers.get("content-range").split("/")[0].split("-").pop(), 10) + 1;

      if (!headers.has("content-range")) {
        throw new Error(
          "The Content-Range header is missing in the HTTP Response. The simple REST client expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?"
        );
      }
      return {
        data: json.map(x => x),
        total: parseInt(headers.get("content-range").split("/").pop(), 10) || maxInPage
      };
    },

    getOne: async (resource, params) => {
      options.headers.set("Accept", "application/vnd.pgrst.object+json");
      const url = `${apiUrl}/${resource}?id=eq.${params.id}`;
      const { json } = await httpClient(url, options);
      return { data: json };
    },

    getMany: async (resource, params) => {
      const url = `${apiUrl}/${resource}?id=in.( ${params.ids.join(",")} )`;
      const { json } = await httpClient(url, options);
      return { data: json };
    },

    getManyReference: async (resource, params) => {
      const filters = {};
      const { field, order } = params.sort;
      filters[params.target] = params.id;
      const query = {
        order: field + "." + order.toLowerCase()
      };
      Object.assign(query, convertFilters(filters));
      const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
      const { headers, json } = await httpClient(url, options);

      const maxInPage = parseInt(headers.get("content-range").split("/")[0].split("-").pop(), 10) + 1;
      if (!headers.has("content-range")) {
        throw new Error(
          "The Content-Range header is missing in the HTTP Response. The simple REST client expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?"
        );
      }
      return {
        data: json.map(x => x),
        total: parseInt(headers.get("content-range").split("/").pop(), 10) || maxInPage
      };
    },

    create: async (resource, params) => {
      options.headers.set("Accept", "application/vnd.pgrst.object+json");
      options.headers.set("Prefer", "return=representation");
      options.method = "POST";
      const postParams = JSON.parse(JSON.stringify(params.data));
      postParams.inserted_at = postParams.updated_at = new Date().toISOString();
      options.body = JSON.stringify(stripReadOnlyColumns(postParams));

      const url = `${apiUrl}/${resource}`;
      const { json } = await httpClient(url, options);

      return { data: json };
    },

    update: async (resource, params) => {
      options.method = "PATCH";
      options.headers.set("Accept", "application/vnd.pgrst.object+json");
      options.headers.set("Prefer", "return=representation");
      options.body = JSON.stringify(stripReadOnlyColumns(params.data));

      const url = `${apiUrl}/${resource}?id=eq.${params.id}`;
      const { json } = await httpClient(url, options);

      return { data: json };
    },

    updateMany: (resource, params) => {
      throw new Error(`Unsupported fetch action type: UPDATE_MANY. Resource: ${resource}. Params: ${params}`);
    },

    delete: async (resource, params) => {
      options.method = "DELETE";

      const url = `${apiUrl}/${resource}?id=eq.${params.id}`;
      await httpClient(url, options);

      return { data: params.previousData };
    },

    deleteMany: async (resource, params) => {
      options.method = "DELETE";
      const url = `${apiUrl}/${resource}?id=in.( ${params.ids.join(",")} )`;

      await httpClient(url, options);

      return { data: params.ids };
    }
  };
};

export { postgrestClient };
