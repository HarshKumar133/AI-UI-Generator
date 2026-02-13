// ============================================
// Shared In-Memory Store
// Temporary — will be replaced by Supabase in production
// ============================================

import { VersionEntry } from '@/types';

const versionHistory: VersionEntry[] = [];

export function getVersionHistory(): VersionEntry[] {
    return [...versionHistory];
}

export function addVersion(entry: VersionEntry): void {
    versionHistory.push(entry);
}

export function getVersion(version: number): VersionEntry | undefined {
    return versionHistory.find((v: VersionEntry) => v.version === version);
}

export function getLatestVersion(): VersionEntry | undefined {
    return versionHistory.length > 0
        ? versionHistory[versionHistory.length - 1]
        : undefined;
}

export function clearVersions(): void {
    versionHistory.length = 0;
}
