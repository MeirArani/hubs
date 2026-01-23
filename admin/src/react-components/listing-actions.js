import { UPDATE } from "react-admin";

export const listingFeature = (resource, id, listing) => ({
  payload: {
    id,
    data: {
      tags: { tags: [...(listing.tags.tags || []), "featured"] }
    }
  },
  meta: { fetch: UPDATE, resource, refresh: true }
});

export const listingUnfeature = (resource, id, listing) => ({
  payload: {
    id,
    data: {
      tags: { tags: [...(listing.tags.tags || []).filter(x => x !== "featured")] }
    }
  },
  meta: { fetch: UPDATE, resource, refresh: true }
});
