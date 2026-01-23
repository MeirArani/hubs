/* eslint-disable @calm/react-intl/missing-formatted-message*/

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { sceneApproveNew, sceneApproveExisting, sceneReviewed } from "./scene-actions";
import { avatarApproveNew, avatarApproveExisting, avatarReviewed } from "./avatar-actions";
import { useCreate, useUpdate } from "react-admin";

function ApproveButton() {
  const [update] = useUpdate();
  const [create] = useCreate();

  const handleClick = () => {
    const { approveNew, approveExisting, reviewed, record, resource } = this.props;
    if (record[`${resource}_listing_id`]) {
      const { payload, meta } = approveExisting(record);
      update(resource, { id: payload.id, data: payload.data, previousData: record, meta: meta });
    } else {
      const { payload, meta } = approveNew(record);
      create(resource, { data: payload.data, meta: meta });
    }

    const { payload, meta } = reviewed(record.id);
    update(meta.resource, { id: payload.id, data: payload.data, previousData: record, meta: meta });
  };

  const { record, resource } = this.props;
  if (!(record.allow_promotion || record._allow_promotion)) return false;

  return (
    <Button label="Approve" onClick={handleClick}>
      {record[`${resource}_listing_id`] ? "Update" : "Approve"}
    </Button>
  );
}

ApproveButton.propTypes = {
  approveNew: PropTypes.func.isRequired,
  approveExisting: PropTypes.func.isRequired,
  reviewed: PropTypes.func.isRequired,
  resource: PropTypes.string.isRequired,
  record: PropTypes.object
};

// const withStaticProps = staticProps => (stateProps, dispatchProps, ownProps) => ({
//   ...ownProps,
//   ...stateProps,
//   ...dispatchProps,
//   ...staticProps
// });

// export const ApproveSceneButton = connect(
//   null,
//   { approveNew: sceneApproveNew, approveExisting: sceneApproveExisting, reviewed: sceneReviewed },
//   withStaticProps({ resource: "scene" })
// )(ApproveButton);

export const ApproveSceneButton = (
  <ApproveButton
    approveNew={sceneApproveNew}
    approveExisting={sceneApproveExisting}
    reviewed={sceneReviewed}
    resource="scene"
  />
);

// export const ApproveAvatarButton = connect(
//   null,
//   { approveNew: avatarApproveNew, approveExisting: avatarApproveExisting, reviewed: avatarReviewed },
//   withStaticProps({ resource: "avatar" })
// )(ApproveButton);

export const ApproveAvatarButton = (
  <ApproveAvatarButton
    approveNew={avatarApproveNew}
    approveExisting={avatarApproveExisting}
    reviewed={avatarReviewed}
    resource="avatar"
  />
);
