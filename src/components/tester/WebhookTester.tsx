'use client';

import { useState } from "react";
import { sendWebhook, WebhookResponse } from "@/lib/api";
import { webhookPresets } from "./presets";
import JsonEditor from "./JsonEditor";
import ResultPanel from "./ResultPanel";

interface Props {
    onSent?: () => void;
}

export default function WebhookTester({ onSent }: Props) {
    const [selectedPreset, setSelectedPreset] = useState(0);
    const [jsonText, setJsonText] = useState(
        JSON.stringify(webhookPresets[0].payload, null, 2),
    );
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [sending, setSending] = useState(false);

    const [lastSentPayload, setLastSentPayload] = useState<Record<string, any> | null>(null);
    const [lastResponse, setLastResponse] = useState<WebhookResponse | null>(null);
    const [responseVariant, setResponseVariant] = useState<'default' | 'success' | 'error'>('default');

    function handlePresetChange(index: number) {
        setSelectedPreset(index);
        setJsonText(JSON.stringify(webhookPresets[index].payload, null, 2));
        setJsonError(null);
    }

    function handleJsonChange(value: string) {
        setJsonText(value);
        try {
            JSON.parse(value);
            setJsonError(null);
        } catch {
            setJsonError('Invalid JSON - check syntax before sending.');
        }
    }

    async function handleSend() {
        let parsedPayload: Record<string, any>;

        try {
            parsedPayload = JSON.parse(jsonText);
        } catch {
            setJsonError('Invalid JSON - check syntax before sending.')
            return;
        }

        setSending(true);
        setLastSentPayload(parsedPayload);

        try {
            const response = await sendWebhook(parsedPayload);
            setLastResponse(response);
            setResponseVariant(response.status === 'success' ? 'success' : 'error');
            onSent?.();
        } catch (err: any) {
            const errorResponse: WebhookResponse = {
                status: 'error',
                message: err?.response?.data?.message ?? err.message ?? 'Request Failed',
            };

            setLastResponse(errorResponse);
            setResponseVariant('error');
        } finally {
            setSending(false);
        }
    }

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Webhook Tester</h3>
                <select
                    value={selectedPreset}
                    onChange={(e) => handlePresetChange(Number(e.target.value))}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
                >
                    {webhookPresets.map((preset, index) => (
                        <option key={preset.label} value={index}>
                            {preset.label}
                        </option>
                    ))}
                </select>
            </div>

            <JsonEditor value={jsonText} onChange={handleJsonChange} error={jsonError} />

            <button
                onClick={handleSend}
                disabled={sending || !!jsonError}
                className="w-full md:w-auto px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:cursor-not-allowed transition"
            >
                {sending ? 'Sending...' : 'Send Webhook'}
            </button>

            <div className="grid md:grid-cols-2 gap-4">
                <ResultPanel title="Payload Sent" data={lastSentPayload} />
                <ResultPanel title="Response Received" data={lastResponse} variant={responseVariant} />
            </div>
        </section>
    );
}