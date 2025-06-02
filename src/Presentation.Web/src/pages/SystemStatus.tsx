import React, { useState } from "react";
import { Card, Input, Button, Typography, Spin, Alert, Table } from "antd";
import { echoApi } from "../features/diagnostics/systemAPI";

const { TextArea } = Input;
const { Title } = Typography;

const envVars = [
    { key: "REACT_APP_API_URL", value: import.meta.env.REACT_APP_API_URL as string },
    { key: "REACT_APP_CAPTAIN_BOBBINS", value: import.meta.env.REACT_APP_CAPTAIN_BOBBINS as string },
    { key: "REACT_APP_MIKE", value: import.meta.env.REACT_APP_MIKE as string }
    // Add more env variables here if needed
];

const SystemStatus: React.FC = () => {
    const [input, setInput] = useState<string>('{"message":"Hello, Echo!"}');
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);
        try {
            const parsed = JSON.parse(input);
            const res = await echoApi(parsed);
            setResponse(res);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "An error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card style={{ maxWidth: 700, margin: "32px auto" }}>
            <Title level={3}>System Status (Echo Test)</Title>
            <p>
                Enter JSON to POST to the <code>EchoController</code> endpoint. The response will be displayed below.
            </p>
            <TextArea
                rows={4}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder='Enter JSON, e.g. {"message":"Hello"}'
                style={{ marginBottom: 16 }}
            />
            <Button type="primary" onClick={handleSend} loading={loading}>
                Send
            </Button>
            <div style={{ marginTop: 24 }}>
                {loading && <Spin />}
                {error && <Alert type="error" message={error} />}
                {response && (
                    <Card type="inner" title="Echo Response" style={{ marginTop: 16 }}>
                        <pre style={{ whiteSpace: "pre-wrap" }}>
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </Card>
                )}
            </div>
            <div style={{ marginTop: 32 }}>
                <Title level={4}>Environment Variables</Title>
                <Table
                    dataSource={envVars}
                    columns={[
                        { title: "Variable", dataIndex: "key", key: "key" },
                        { title: "Value", dataIndex: "value", key: "value" }
                    ]}
                    pagination={false}
                    size="small"
                    rowKey="key"
                />
            </div>
        </Card>
    );
};

export default SystemStatus;