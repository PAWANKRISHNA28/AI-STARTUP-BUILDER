import {
  Project,
  User,
  Blueprint,
  BlueprintData,
  GenerationStatus,
  ProjectChat,
  ProjectVersion,
  Comment,
  SharedProject,
  Notification,
  ActivityLog,
  Analytics,
} from "../types";

/**
 * =====================================================
 * API CONFIGURATION
 * =====================================================
 */

const API_BASE =
  import.meta.env.VITE_API_URL || "/api/v1";

/**
 * =====================================================
 * COMMON HEADERS
 * =====================================================
 */

function getHeaders(): HeadersInit {
  const token =
    sessionStorage.getItem("token") ||
    localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * =====================================================
 * API CACHE
 * =====================================================
 */
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute

async function fetchWithCache(url: string, options: RequestInit = {}) {
  const method = options.method || "GET";
  const cacheKey = `${method}:${url}`;

  if (method === "GET") {
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
  }

  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (error: any) {
    // This catches network errors, CORS errors, or if the server is unreachable
    console.error(`[Network Error] fetching ${url}:`, error);
    throw {
      status: 0,
      response: {
        data: { detail: 'Network error: Unable to connect to the server. Please check your connection or try again later.' }
      }
    };
  }

  const data = await handleResponse(res);

  if (method === "GET") {
    apiCache.set(cacheKey, { data, timestamp: Date.now() });
  }

  return data;
}

/**
 * =====================================================
 * COMMON RESPONSE HANDLER
 * =====================================================
 */

async function handleResponse(res: Response) {
  if (!res.ok) {
    let error: any = {};

    try {
      error = await res.json();
    } catch {
      error = {
        detail: "Unknown server error",
      };
    }

    throw {
      status: res.status,
      response: {
        data: error,
      },
    };
  }

  if (res.status === 204) return null;

  return res.json();
}

/**
 * =====================================================
 * API OBJECT
 * =====================================================
 */

export const api = {
  /**
   * ==========================================
   * AUTH
   * ==========================================
   */

  async register(
    fullName: string,
    email: string,
    password: string,
    phone: string
  ): Promise<User> {

    const res = await fetchWithCache(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        full_name: fullName,
        email,
        password,
        phone_number: phone,
      }),
    });

    return res;
  },

  async loginEmail(
    email: string,
    password: string
  ): Promise<{
    access_token: string;
    refresh_token: string;
    is_guest: boolean;
    user: User;
  }> {

    const data = await fetchWithCache(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        email,
        password,
      }),
    });

    sessionStorage.setItem(
      "token",
      data.access_token
    );

    localStorage.setItem(
      "token",
      data.access_token
    );

    if (data.refresh_token) {
      localStorage.setItem(
        "refresh_token",
        data.refresh_token
      );
    }

    return data;
  },

  async requestPhoneOTP(phoneNumber: string): Promise<{ message: string }> {

    const res = await fetchWithCache(`${API_BASE}/auth/login/phone`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        identifier: phoneNumber,
        purpose: "login",
      }),
    });

    return res;
  },

  async verifyPhoneOTP(
    phoneNumber: string,
    code: string
  ): Promise<{
    access_token: string;
    refresh_token: string;
    is_guest: boolean;
    user: User;
  }> {

    const data = await fetchWithCache(`${API_BASE}/auth/verify-otp`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        identifier: phoneNumber,
        code,
        purpose: "login",
      }),
    });

    sessionStorage.setItem(
      "token",
      data.access_token
    );

    localStorage.setItem(
      "token",
      data.access_token
    );

    if (data.refresh_token) {
      localStorage.setItem(
        "refresh_token",
        data.refresh_token
      );
    }

    return data;
  },

  async loginGuest(
    deviceId: string
  ): Promise<{
    access_token: string;
    refresh_token: string;
    is_guest: boolean;
    user: User;
  }> {

    const data = await fetchWithCache(`${API_BASE}/auth/guest`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        device_id: deviceId,
      }),
    });

    sessionStorage.setItem(
      "token",
      data.access_token
    );

    localStorage.setItem(
      "token",
      data.access_token
    );

    if (data.refresh_token) {
      localStorage.setItem(
        "refresh_token",
        data.refresh_token
      );
    }

    return data;
  },

  async logout(): Promise<void> {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
  },

  /**
   * ==========================================
   * USER
   * ==========================================
   */

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      let error: any = {};
      try { error = await res.json(); } catch { error = { detail: "Unknown server error" }; }
      throw { status: res.status, response: { data: error } };
    }
    return res.json();
  },

  async updateMe(
    data: Partial<User>
  ): Promise<User> {

    const res = await fetchWithCache(`${API_BASE}/auth/me`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return res;
  },

  /**
   * ==========================================
   * PROJECTS
   * ==========================================
   */

  async createProject(
    data: Partial<Project>
  ): Promise<Project> {

    const res = await fetchWithCache(`${API_BASE}/projects/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return res;
  },

  async listProjects(
    page = 1,
    limit = 10,
    search?: string,
    filter_by?: string,
    sort_by?: string
  ): Promise<{
    items: Project[];
    total: number;
    page: number;
    limit: number;
    has_more: boolean;
  }> {

    let url = `${API_BASE}/projects/?page=${page}&limit=${limit}`;

    if (search)
      url += `&search=${encodeURIComponent(search)}`;

    if (filter_by)
      url += `&filter_by=${filter_by}`;

    if (sort_by)
      url += `&sort_by=${sort_by}`;

    const res = await fetchWithCache(url, {
      headers: getHeaders(),
    });

    return res;
  },

  async getProject(id: string): Promise<Project> {

    const res = await fetchWithCache(`${API_BASE}/projects/${id}`, {
      headers: getHeaders(),
    });

    return res;
  },

  async updateProject(
    id: string,
    data: Partial<Project>
  ): Promise<Project> {

    const res = await fetchWithCache(`${API_BASE}/projects/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return res;
  },

  async deleteProject(id: string): Promise<void> {

    await fetchWithCache(`${API_BASE}/projects/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  },

  /**
 * =====================================================
 * PROJECT MANAGEMENT
 * =====================================================
 */

  async deleteProjectPermanently(id: string): Promise<void> {
    await fetchWithCache(`${API_BASE}/projects/${id}/permanent`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  },

  async restoreProject(id: string): Promise<Project> {
    const res = await fetchWithCache(`${API_BASE}/projects/${id}/restore`, {
      method: "POST",
      headers: getHeaders(),
    });

    return res;
  },

  async archiveProject(id: string): Promise<Project> {
    const res = await fetchWithCache(`${API_BASE}/projects/${id}/archive`, {
      method: "POST",
      headers: getHeaders(),
    });

    return res;
  },

  async unarchiveProject(id: string): Promise<Project> {
    const res = await fetchWithCache(`${API_BASE}/projects/${id}/unarchive`, {
      method: "POST",
      headers: getHeaders(),
    });

    return res;
  },

  async duplicateProject(id: string): Promise<Project> {
    const res = await fetchWithCache(`${API_BASE}/projects/${id}/duplicate`, {
      method: "POST",
      headers: getHeaders(),
    });

    return res;
  },

  /**
   * =====================================================
   * BLUEPRINT AUTO SAVE
   * =====================================================
   */

  async updateProjectBlueprint(
    id: string,
    blueprintData: BlueprintData
  ): Promise<Blueprint> {

    const res = await fetchWithCache(`${API_BASE}/projects/${id}/blueprint`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(blueprintData),
    });

    return res;
  },

  /**
   * =====================================================
   * AI GENERATION
   * =====================================================
   */

  async triggerGeneration(projectId: string, startupIdea: string): Promise<void> {

    await fetchWithCache(
      `${API_BASE}/startup/analyze`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ project_id: projectId, startup_idea: startupIdea })
      }
    );
  },

  async getGenerationStatus(
    projectId: string
  ): Promise<GenerationStatus> {

    const res = await fetchWithCache(
      `${API_BASE}/startup/status/${projectId}`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  async getBlueprint(projectId: string): Promise<Blueprint> {

    const res = await fetchWithCache(
      `${API_BASE}/startup/blueprint/${projectId}`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  /**
   * =====================================================
   * PROJECT CHAT
   * =====================================================
   */

  async getProjectChat(
    projectId: string
  ): Promise<ProjectChat[]> {

    const res = await fetchWithCache(
      `${API_BASE}/chat/history/${projectId}`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  async sendProjectChatMessage(
    projectId: string,
    message: string
  ): Promise<ProjectChat> {

    const res = await fetchWithCache(
      `${API_BASE}/chat/`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          project_id: projectId,
          message,
        }),
      }
    );

    return res;
  },

  /**
   * =====================================================
   * VERSION CONTROL
   * =====================================================
   */

  async listProjectVersions(
    projectId: string
  ): Promise<ProjectVersion[]> {

    const res = await fetchWithCache(
      `${API_BASE}/projects/${projectId}/versions`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  async createProjectVersion(
    projectId: string,
    name: string
  ): Promise<ProjectVersion> {

    const res = await fetchWithCache(
      `${API_BASE}/projects/${projectId}/versions`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          name,
        }),
      }
    );

    return res;
  },

  async restoreProjectVersion(
    projectId: string,
    versionId: string
  ): Promise<Project> {

    const res = await fetchWithCache(
      `${API_BASE}/projects/${projectId}/versions/${versionId}/restore`,
      {
        method: "POST",
        headers: getHeaders(),
      }
    );

    return res;
  },

  /**
 * =====================================================
 * COMMENTS
 * =====================================================
 */

  async listProjectComments(
    projectId: string
  ): Promise<Comment[]> {

    const res = await fetchWithCache(
      `${API_BASE}/projects/${projectId}/comments`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  async postProjectComment(
    projectId: string,
    content: string
  ): Promise<Comment> {

    const res = await fetchWithCache(
      `${API_BASE}/projects/${projectId}/comments`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          content,
        }),
      }
    );

    return res;
  },

  async updateComment(
    projectId: string,
    commentId: string,
    content: string
  ): Promise<Comment> {

    const res = await fetchWithCache(
      `${API_BASE}/projects/${projectId}/comments/${commentId}`,
      {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({
          content,
        }),
      }
    );

    return res;
  },

  async deleteComment(
    projectId: string,
    commentId: string
  ): Promise<void> {

    await fetchWithCache(
      `${API_BASE}/projects/${projectId}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );
  },

  /**
   * =====================================================
   * PROJECT SHARING
   * =====================================================
   */

  async listSharedUsers(
    projectId: string
  ): Promise<SharedProject[]> {

    const res = await fetchWithCache(
      `${API_BASE}/projects/${projectId}/shares`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  async shareProject(
    projectId: string,
    email: string,
    role: string
  ): Promise<SharedProject> {

    const res = await fetchWithCache(
      `${API_BASE}/projects/${projectId}/shares`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          user_email: email,
          role,
        }),
      }
    );

    return res;
  },

  async removeSharedUser(
    projectId: string,
    shareId: string
  ): Promise<void> {

    await fetchWithCache(
      `${API_BASE}/projects/${projectId}/shares/${shareId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );
  },

  /**
   * =====================================================
   * NOTIFICATIONS
   * =====================================================
   */

  async listNotifications(): Promise<Notification[]> {

    const res = await fetchWithCache(
      `${API_BASE}/notifications/list`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  async markNotificationRead(
    id: string
  ): Promise<void> {

    await fetchWithCache(
      `${API_BASE}/notifications/${id}/read`,
      {
        method: "POST",
        headers: getHeaders(),
      }
    );
  },

  async markAllNotificationsRead(): Promise<void> {

    await fetchWithCache(
      `${API_BASE}/notifications/read-all`,
      {
        method: "POST",
        headers: getHeaders(),
      }
    );
  },

  /**
   * =====================================================
   * ACTIVITY TIMELINE
   * =====================================================
   */

  async listProjectActivities(
    projectId: string
  ): Promise<ActivityLog[]> {

    const res = await fetchWithCache(
      `${API_BASE}/projects/${projectId}/activities`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  /**
   * =====================================================
   * ANALYTICS
   * =====================================================
   */

  async getAnalyticsSummary(): Promise<Analytics> {

    const res = await fetchWithCache(
      `${API_BASE}/analytics/dashboard`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  async getDashboardAnalytics(): Promise<any> {

    const res = await fetchWithCache(
      `${API_BASE}/analytics/dashboard`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  async getAgentAnalytics(
    projectId: string
  ): Promise<any> {

    const res = await fetchWithCache(
      `${API_BASE}/analytics/agents/${projectId}`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  /**
   * =====================================================
   * CHAT
   * =====================================================
   */
  async sendChatMessage(projectId: string, message: string): Promise<any> {
    const res = await fetchWithCache(
      `${API_BASE}/chat/`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ project_id: projectId, message }),
      }
    );
    return res;
  },

  getExportUrl(projectId: string, format: string): string {
    return `${API_BASE}/reports/export/${projectId}?format=${format}`;
  },

  /**
   * =====================================================
   * SEARCH
   * =====================================================
   */

  async searchProjects(
    query: string
  ): Promise<Project[]> {

    const res = await fetchWithCache(
      `${API_BASE}/projects/search?q=${encodeURIComponent(query)}`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  async recentProjects(): Promise<Project[]> {

    const res = await fetchWithCache(
      `${API_BASE}/projects/recent`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  /**
 * =====================================================
 * GOOGLE MAPS BUSINESS INTELLIGENCE
 * =====================================================
 */

  async searchBusinessLocation(data: {
    business_type: string;
    city: string;
    budget?: number;
  }): Promise<any> {

    const res = await fetchWithCache(
      `${API_BASE}/location/business-location`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }
    );

    return res;
  },

  async nearbyCompetitors(
    latitude: number,
    longitude: number,
    radius = 5000
  ): Promise<any[]> {

    const res = await fetchWithCache(
      `${API_BASE}/location/competitors?lat=${latitude}&lng=${longitude}&radius=${radius}`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  async locationAnalytics(
    latitude: number,
    longitude: number
  ): Promise<any> {

    const res = await fetchWithCache(
      `${API_BASE}/location/analytics?lat=${latitude}&lng=${longitude}`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  async demographicAnalysis(
    latitude: number,
    longitude: number
  ): Promise<any> {

    const res = await fetchWithCache(
      `${API_BASE}/location/demographics?lat=${latitude}&lng=${longitude}`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  async trafficPrediction(
    latitude: number,
    longitude: number
  ): Promise<any> {

    const res = await fetchWithCache(
      `${API_BASE}/location/traffic?lat=${latitude}&lng=${longitude}`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  /**
   * =====================================================
   * VISUALIZATION STUDIO
   * =====================================================
   */

  async createVisualization(data: any): Promise<any> {

    const res = await fetchWithCache(
      `${API_BASE}/visualization/create`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }
    );

    return res;
  },

  async create3DVisualization(data: any): Promise<any> {

    const res = await fetchWithCache(
      `${API_BASE}/visualization/3d`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }
    );

    return res;
  },

  async getVisualizationHistory(
    projectId: string
  ): Promise<any[]> {

    const res = await fetchWithCache(
      `${API_BASE}/visualization/history/${projectId}`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  async saveFavoriteVisualization(
    imageId: string,
    notes?: string
  ): Promise<any> {

    const res = await fetchWithCache(
      `${API_BASE}/visualization/save`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          visualization_image_id: imageId,
          notes,
        }),
      }
    );

    return res;
  },

  async getFavoriteVisualizations(): Promise<any[]> {

    const res = await fetchWithCache(
      `${API_BASE}/visualization/favorites`,
      {
        headers: getHeaders(),
      }
    );

    return res;
  },

  /**
   * =====================================================
   * AI RECOMMENDATIONS
   * =====================================================
   */

  async getStartupSuggestions(prompt: string): Promise<any> {

    const res = await fetchWithCache(
      `${API_BASE}/ai/startup-suggestions`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          prompt,
        }),
      }
    );

    return res;
  },

  async generateBusinessPlan(projectId: string): Promise<any> {

    const res = await fetchWithCache(
      `${API_BASE}/ai/business-plan/${projectId}`,
      {
        method: "POST",
        headers: getHeaders(),
      }
    );

    return res;
  },

  async generatePitchDeck(projectId: string): Promise<any> {

    const res = await fetchWithCache(
      `${API_BASE}/ai/pitch-deck/${projectId}`,
      {
        method: "POST",
        headers: getHeaders(),
      }
    );

    return res;
  },

  async generateRoadmap(projectId: string): Promise<any> {

    const res = await fetchWithCache(
      `${API_BASE}/ai/roadmap/${projectId}`,
      {
        method: "POST",
        headers: getHeaders(),
      }
    );

    return res;
  },

};