import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

export interface IntegrationLog {
    id: string;
    event: string;
    source: string;
    summary: string;
    status: 'success' | 'error';
    errorMsg: 'string' | null;
    rawPayload: Record<string, any>;
    createdAt: string;
}

export interface LogsResponse {
    total: number;
    count: number;
    logs: IntegrationLog[];
}

export interface StatsResponse {
    total: number;
    success: number;
    error: number;
    successRate: string;
    bySource: { source: string; count: number }[];
}

export interface TimeSeriesPoint {
    timestamp: string;
    success: number;
    error: number;
    total: number;
}

export interface WebhookResponse {
    status: 'success' | 'error';
    event?: string;
    timestamp?: string;
    message?: string;
}

// --API Functions--

export async function fetchLogs(params?: {
    status?: string;
    source?: string;
    limit?: number;
}): Promise<LogsResponse> {
    const { data } = await apiClient.get<LogsResponse>('/webhook/logs', { params });
    return data;
}

export async function fetchStats(): Promise<StatsResponse> {
    const { data } = await apiClient.get<StatsResponse>('/webhook/stats');
    return data;
}

export async function fetchTimeSeries(hours: number = 24): Promise<TimeSeriesPoint[]> {
    const { data } = await apiClient.get<TimeSeriesPoint[]>('/webhook/timeseries', {
        params: { hours },
    });
    return data;
}

export async function sendWebhook(payload: Record<string, any>): Promise<WebhookResponse> {
    const { data } = await apiClient.get<WebhookResponse>('/webhook/receive', payload);
    return data;
}