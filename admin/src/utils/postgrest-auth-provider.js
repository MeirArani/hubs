export const newPostgrestAuthProvider = {
  async login({ retPhxChannel }) {
    const token = await this.refreshPermsToken(retPhxChannel);
    localStorage.setItem("token", token);
  },

  async checkError(error) {
    const status = error.status;
    if (status === 401 || status === 403) {
      let redirectTo = "/?sign_in&sign_in_destination=admin";

      if (localStorage.getItem("token")) {
        redirectTo = redirectTo + "&sign_in_reason=admin_no_permission";
      }
      localStorage.removeItem("token");
      document.location = redirectTo;
    }
  },

  async checkAuth() {
    if (!localStorage.getItem("token")) {
      throw new Error("Not authenticated!");
    }
  },

  async logout() {
    localStorage.removeItem("token");
    return Promise.resolve();
  },

  refreshPermsToken(retPhxChannel) {
    return new Promise((resolve, reject) => {
      retPhxChannel
        .push("refresh_perms_token")
        .receive("ok", ({ perms_token }) => {
          localStorage.SetItem("token", perms_token);
          resolve(perms_token);
        })
        .receive("error", err => {
          console.error("failed to fetch perms", err);
          reject();
        });
    });
  },

  setAuthToken(token) {
    localStorage.setItem("token", token);
  }
};
