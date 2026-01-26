/* eslint-disable @calm/react-intl/missing-formatted-message*/

import React from "react";
import { IdentityEditLink, IdentityCreateLink } from "./fields";
import { AccountEditToolbar } from "./account-edit-toolbar";
import withStyles from "@mui/styles/withStyles";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import MuiTextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import CircularProgress from "@mui/material/CircularProgress";
// import Snackbar from "@mui/material/Snackbar";
// import SnackbarContent from "@mui/material/SnackbarContent";
// import { email, useRefresh } from "react-admin";
// import { useMutation, useQuery } from "@tanstack/react-query";
import {
  BooleanField,
  BooleanInput,
  Datagrid,
  DateField,
  Edit,
  EditButton,
  Filter,
  List,
  ReferenceManyField,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput
} from "react-admin";

const styles = {
  hide: { display: "none" },
  noBorder: { border: "0px" },
  searchCard: { marginBottom: "5px" }
};

const AccountFilter = props => (
  <Filter {...props}>
    <TextInput label="Search ID" source="_text_id" alwaysOn />
  </Filter>
);

// function useAccountSearch({ email }) {
//   return useQuery({
//     queryKey: ["accounts", { email }],
//     queryFn: async () => {
//       const result = await fetch("/api/v1/accounts/search", {
//         method: "post",
//         headers: {
//           "content-type": "application/json",
//           authorization: `bearer ${window.APP.store.state.credentials.token}`
//         },
//         body: JSON.stringify({ email: email || "" })
//       }).then(r => r.json());
//       if (result && result.data) {
//         //window.location = `#/accounts/${result.data[0].id}`;
//         return result.data[0];
//       } else {
//         throw new Error(`Account ${email} not found!`);
//       }
//     }
//   });
// }

// function useAccountCreate({ batchCreate }) {
//   return useMutation({
//     mutationFn: async batchCreate => {
//       if (batchCreate.length === 0) throw new Error("No accounts provided for creation!");
//       const data = this.state.batchCreate
//         .split(";") // ['email1,identity1', '', 'email2','email3,identity with spaces', 'email4']
//         .filter(accounts => accounts !== "")
//         .map(accounts => {
//           const emailAndIdentity = accounts.split(",");
//           return emailAndIdentity.length === 1
//             ? {
//                 email: emailAndIdentity[0].trim()
//               }
//             : {
//                 email: emailAndIdentity[0].trim(),
//                 name: emailAndIdentity[1].trim()
//               };
//         });

//       const result = fetch("/api/v1/accounts", {
//         method: "post",
//         headers: {
//           "content-type": "application/json",
//           authorization: `bearer ${window.APP.store.state.credentials.token}`
//         },
//         body: JSON.stringify({
//           data: data.length === 1 ? data[0] : data
//         })
//       }).then(r => r.json());

//       if (!result) throw new Error("Failed to create accounts!");

//       if (result.errors) {
//         // one email has errors
//         throw new Error(result.errors[0].detail);
//       }

//       if (Array.isArray(result)) {
//         // Multiple email accounts created
//         // results = {
//         //   'successMsg': [email1, ..., email3],
//         //   'errorMsg1': [email4],
//         //   'errorMsg2': [email5, email6]
//         // }
//         const results = {};
//         let isAllSuccess = true;
//         let hasOneSuccess = false;
//         result.forEach((emailResponse, index) => {
//           isAllSuccess = isAllSuccess && emailResponse.status === 200;
//           hasOneSuccess = hasOneSuccess || emailResponse.status === 200;
//           const message =
//             emailResponse.status === 200 ? "Created accounts successfully" : emailResponse.body.errors[0].detail;
//           const email = data[index].email;
//           if (results[message]) results[message].push(email);
//           else results[message] = [email];
//         });
//         return {
//           createStatus: isAllSuccess
//             ? "Success adding all accounts"
//             : hasOneSuccess
//               ? "Success adding some accounts, Errors adding some accounts"
//               : "Errors adding all accounts",
//           createResults: results
//         };
//       }

//       // if (result.data)
//       // one email added successfully
//       return { createStatus: `Account created successfully` };

//       // Quickfix snackbar component does not always close
//       // Setting snackbar message to empty string closes
//       this.clearCreateStatusTimer();
//     },
//     onSuccess: (data, variables, onMutateResult, context) => {
//       useRefresh();
//     },
//     onError: (error, variables, onMurateResult, context) => {},
//     onSettled: (data, error, variables, onMutateResult, context) => {
//       const ret = data.json();
//       if (ret && ret.data) {
//       }
//     }
//   });
// }

export const AccountList = withStyles(styles)(function AccountList({ classes, ...other }) {
  // [emailSearch, setEmailSearch] = useState("");
  // [searchState, setSearchState] = useState({ searching: false, searchStatus: null });
  // [createState, setCreateState] = useState({ createResults: "" });

  // const { isPending, isError, data, error } = useAccountSearch({ emailSearch });
  // const {data, error, isPending, isSuccess } = useAccountCreate({});

  return (
    <>
      {/* <Card className={classes.searchCard}>
        <CardContent>
          <Typography component="h2">
            <b>Create one or multiple accounts with (optional) identities</b>
          </Typography>
          <Typography component="h3">
            <i>Single example:</i> email1,identity1
          </Typography>
          <Typography component="h3">
            <i>Multiple example:</i> email1,identity1;email2;email3,identity3 with spaces;email4
          </Typography>
          <form onSubmit={this.onCreateAccount.bind(this)}>
            <MuiTextField
              label="Email, (optional) identity"
              type="text"
              style={{ minWidth: "300px" }}
              required
              onChange={e => this.setState({ batchCreate: e.target.value })}
            />
            <Button onClick={this.onCreateAccount.bind(this)}>Create</Button>
            {this.state.creating && <CircularProgress />}
            <Snackbar open={"this.state.createStatus"} autoHideDuration={5000}>
              <SnackbarContent message={"this.state.createStatus"}></SnackbarContent>
            </Snackbar>
          </form>
          {this.state.createResults &&
            Object.keys(this.state.createResults).map(message => (
              <>
                <Typography
                  component="p"
                  color={message.includes("success") ? "textPrimary" : "error"}
                  style={{ paddingTop: "10px" }}
                >
                  {message}
                </Typography>
                <Typography component="p" color="secondary" style={{ paddingBottom: "10px" }}>
                  [ {this.state.createResults[message].join(", ")} ]
                </Typography>
              </>
            ))}
        </CardContent>
      </Card>
      <Card className={classes.searchCard}>
        <CardContent>
          <Typography component="h2">Find an account with an email address</Typography>
          <form onSubmit={this.onAccountSearch.bind(this)}>
            <MuiTextField
              label="Account Email"
              type="email"
              required
              onChange={e => this.setState({ emailSearch: e.target.value })}
            />
            <Button onClick={this.onAccountSearch.bind(this)}>Find</Button>
            {this.state.searching && <CircularProgress />}
            <Snackbar open={this.state.searchStatus} autoHideDuration={5000}>
              <SnackbarContent message={this.state.searchStatus}></SnackbarContent>
            </Snackbar>
          </form>
        </CardContent>
      </Card> */}
      <List {...other} filters={<AccountFilter />} bulkActionButtons={false}>
        <Datagrid>
          <TextField source="id" />
          <DateField source="inserted_at" />
          <DateField source="updated_at" />
          <ReferenceManyField label="Identity" target="_account_id" reference="identities">
            <Datagrid classes={{ rowCell: classes.noBorder, thead: classes.hide }}>
              <TextField source="name" />
              <IdentityEditLink />
            </Datagrid>
          </ReferenceManyField>

          <IdentityCreateLink />
          <BooleanField source="is_admin" />
          <TextField source="state" />
          <EditButton />
        </Datagrid>
      </List>
    </>
  );
});

export const AccountEdit = withStyles(styles)(props => {
  const { classes, ...other } = props;

  return (
    <Edit {...other}>
      <SimpleForm toolbar={<AccountEditToolbar {...other} />}>
        <TextField label="Account ID" source="id" />
        <BooleanInput source="is_admin" />
        <SelectInput
          source="state"
          choices={[
            { id: "enabled", name: "enabled" },
            { id: "disabled", name: "disabled" }
          ]}
        />

        <ReferenceManyField label="Identity" target="_account_id" reference="identities">
          <Datagrid classes={{ rowCell: classes.noBorder, thead: classes.hide }}>
            <TextField source="name" />
            <IdentityEditLink />
          </Datagrid>
        </ReferenceManyField>
      </SimpleForm>
    </Edit>
  );
});
