
'use server';

export async function getNeonProjectStatus() {
  const projectId = process.env.NEON_PROJECT_ID;
  const apiKey = process.env.NEON_API_KEY;

  if (!projectId || !apiKey) {
    throw new Error("NEON_PROJECT_ID or NEON_API_KEY is not defined");
  }

  const response = await fetch(`https://console.neon.tech/api/v2/projects/${projectId}/branches`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    },
    next: { revalidate: 60 } // Cache for 1 minute
  });

  if (!response.ok) {
    throw new Error(`Neon API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
