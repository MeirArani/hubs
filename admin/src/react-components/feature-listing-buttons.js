import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { listingFeature, listingUnfeature } from "./listing-actions";
import { useUpdate } from "react-admin";

const isFeatured = record => (record.tags ? (record.tags.tags || []).includes("featured") : false);

function FeatureListingButton({ feature, unfeature, record, resource }) {
  const featured = isFeatured(record);
  const label = featured ? "Unfeature" : "Feature";
  const [update] = useUpdate();
  const { payload, meta } = (featured ? unfeature : feature)(resource, record.id, record);
  return (
    <Button
      label={label}
      onClick={() => update(resource, { id: payload.id, data: payload.data, previousData: record, meta: meta })}
    >
      {label}
    </Button>
  );
}

FeatureListingButton.propTypes = {
  feature: PropTypes.func.isRequired,
  unfeature: PropTypes.func.isRequired,
  resource: PropTypes.string.isRequired,
  record: PropTypes.object
};

// const withStaticProps = staticProps => (stateProps, dispatchProps, ownProps) => ({
//   ...ownProps,
//   ...stateProps,
//   ...dispatchProps,
//   ...staticProps
// });

export const FeatureSceneListingButton = (
  <FeatureListingButton feature={listingFeature} unfeature={listingUnfeature} resource="scene_listings" />
);

export const FeatureAvatarListingButton = (
  <FeatureListingButton feature={listingFeature} unfeature={listingUnfeature} resource="avatar_listings" />
);

// export const FeatureSceneListingButton = connect(
//   null,
//   { feature: listingFeature, unfeature: listingUnfeature },
//   withStaticProps({ resource: "scene_listings" })
// )(FeatureListingButton);

// export const FeatureAvatarListingButton = connect(
//   null,
//   { feature: listingFeature, unfeature: listingUnfeature },
//   withStaticProps({ resource: "avatar_listings" })
// )(FeatureListingButton);
