/* eslint-disable @calm/react-intl/missing-formatted-message*/
import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { sceneReviewed } from "./scene-actions";
import { avatarReviewed } from "./avatar-actions";
import { useUpdate } from "react-admin";
function DenyButton({ reviewed, record }) {
  const [update] = useUpdate();
  if (!(record.allow_promotion || record._allow_promotion)) return false;

  const { payload, meta } = reviewed(record.id);
  return (
    <Button
      label="Deny"
      onClick={() => update(meta.resource, { id: payload.id, data: payload.data, previousData: record, meta: meta })}
    >
      Deny
    </Button>
  );
}

DenyButton.propTypes = {
  reviewed: PropTypes.func.isRequired,
  record: PropTypes.object
};

export const DenySceneButton = <DenyButton reviewed={sceneReviewed} />;
export const DenyAvatarButton = <DenyButton reviewed={avatarReviewed} />;
