import { useEffect, useState } from "react";
import { fetchlogs } from "../utils/api";

function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await fetchlogs();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading logs...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">System Logs</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Username</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
              <th className="border border-gray-300 px-4 py-2">Target</th>
              <th className="border border-gray-300 px-4 py-2">TimeStamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{log.username}</td>
                <td className="border border-gray-300 px-4 py-2">{log.role}</td>
                <td className="border border-gray-300 px-4 py-2">{log.action}</td>
                <td className="border border-gray-300 px-4 py-2">{log.targetName}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(log.timeStamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LogsPage;
