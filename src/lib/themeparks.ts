const BASE = "https://api.themeparks.wiki/v1";

export interface LiveEntity {
  id: string;
  name: string;
  entityType: string;
  status?: string;
  queue?: {
    STANDBY?: { waitTime: number | null };
    SINGLE_RIDER?: { waitTime: number | null };
    RETURN_TIME?: { returnStart: string; returnEnd: string; state: string };
  };
  lastUpdated?: string;
}

export interface LiveResponse {
  liveData: LiveEntity[];
}

export interface ChildEntity {
  id: string;
  name: string;
  entityType: string;
  externalId?: string;
}

export interface ChildrenResponse {
  id: string;
  name: string;
  entityType: string;
  children: ChildEntity[];
}

export async function getLiveData(entityId: string): Promise<LiveResponse> {
  const res = await fetch(`${BASE}/entity/${entityId}/live`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`ThemeParks API error ${res.status}`);
  return res.json();
}

export async function getChildren(entityId: string): Promise<ChildrenResponse> {
  const res = await fetch(`${BASE}/entity/${entityId}/children`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`ThemeParks API error ${res.status}`);
  return res.json();
}

export async function getLiveDataNoCache(entityId: string): Promise<LiveResponse> {
  const res = await fetch(`${BASE}/entity/${entityId}/live`, { cache: "no-store" });
  if (!res.ok) throw new Error(`ThemeParks API error ${res.status}`);
  return res.json();
}
