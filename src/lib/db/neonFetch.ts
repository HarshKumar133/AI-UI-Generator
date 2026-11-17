import { neonConfig } from '@neondatabase/serverless';
import { Agent, fetch as undiciFetch } from 'undici';

let configured = false;

function resolveWithDnsOverHttps(hostname: string, options: { all?: boolean }, callback: (error: Error | null, address?: string | { address: string; family: number }[], family?: number) => void): void {
  void fetch(`https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=A`)
    .then((response) => response.json() as Promise<{ Answer?: Array<{ type?: number; data?: string }> }>)
    .then((body) => {
      const address = body.Answer?.find((answer) => answer.type === 1)?.data;
      if (!address) throw new Error(`No IPv4 record found for ${hostname}.`);
      callback(null, options.all ? [{ address, family: 4 }] : address, 4);
    })
    .catch((error: unknown) => callback(error instanceof Error ? error : new Error('DNS lookup failed.')));
}

/**
 * Some local resolvers reject Neon endpoint lookups even though the endpoint is
 * valid. Preserve normal DNS first and retry only failed Neon fetches through a
 * development-only DNS-over-HTTPS dispatcher. Production keeps platform DNS.
 */
export function configureNeonFetch(): void {
  if (configured || process.env.NODE_ENV === 'production') return;
  configured = true;

  const dispatcher = new Agent({ connect: { lookup: resolveWithDnsOverHttps as never } });
  neonConfig.fetchFunction = async (input: string, init?: RequestInit) => {
    try {
      return await fetch(input, init);
    } catch (error) {
      const hostname = new URL(input).hostname;
      if (!hostname.endsWith('.neon.tech')) throw error;
      return undiciFetch(input, { ...(init as Parameters<typeof undiciFetch>[1]), dispatcher });
    }
  };
}
