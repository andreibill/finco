import { API_ROUTES } from "@constants/api-routes";
import { delay } from "@mocks/delay";
import { store } from "@mocks/fixtures";
import type { ApiResponse, User } from "@types";
import { ok } from "@services/response";

export const meService = {
  // GET /api/me
  async get(): Promise<ApiResponse<User>> {
    void API_ROUTES.ME.GET;
    await delay(400);
    return ok({ ...store.user });
  },

  // PUT /api/me/notifications
  async setNotifications(active: boolean): Promise<ApiResponse<User>> {
    void API_ROUTES.ME.NOTIFICATIONS;
    await delay(400);
    store.user.notificari_active = active;
    return ok({ ...store.user }, "Setari notificari salvate");
  },
};
