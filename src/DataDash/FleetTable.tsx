import { ChevronRight, MoreVertical } from "lucide-react";
import { fleetData } from "./mockData";
import { C, getBatteryColor, getStatusStyle } from "./tokens";

interface FleetTableProps {
  dark: boolean;
  showAll: boolean;
  setShowAll: React.Dispatch<React.SetStateAction<boolean>>;
}

export function FleetTable({ dark, showAll, setShowAll }: FleetTableProps) {
  const rows = showAll ? fleetData : fleetData.slice(0, 3);

  const headers = ["Vehicle ID", "Status", "Driver", "Location", "Battery/Fuel", "Actions"];

  return (
    <div
      className="rounded-xl border"
      style={{
        background: dark ? C.darkSurface : C.lightSurface,
        borderColor: dark ? C.darkBorder : C.lightBorder,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 13, fontWeight: 600, color: dark ? C.darkText : C.lightText }}>
            Fleet Monitoring
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.primaryPurple }}>
            1,204 Units
          </span>
        </div>
        <button className="flex items-center gap-1 text-xs font-medium" style={{ color: C.primaryPurple }}>
          View Detailed Fleet <ChevronRight size={12} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${dark ? C.darkBorder : C.lightBorder}` }}>
              {headers.map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "6px 12px 8px",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: dark ? C.gray7B : C.lightSubtext,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((v, i) => {
              const { bg, text } = getStatusStyle(v.status);
              const batColor = getBatteryColor(v.battery);
              return (
                <tr
                  key={v.id}
                  style={{
                    borderBottom:
                      i < rows.length - 1
                        ? `1px solid ${dark ? C.darkBorder : C.lightBorder}`
                        : "none",
                    transition: "background .15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = dark
                      ? "rgba(168,85,247,.04)"
                      : "rgba(168,85,247,.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* Vehicle ID */}
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        fontFamily: "DM Mono, monospace",
                        fontSize: 11,
                        fontWeight: 500,
                        color: C.primaryPurple,
                      }}
                    >
                      {v.id}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: bg,
                        color: text,
                      }}
                    >
                      {v.status}
                    </span>
                  </td>

                  {/* Driver */}
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 12,
                      color: v.driver
                        ? dark ? C.darkText : C.lightText
                        : dark ? C.gray7B : C.lightSubtext,
                      fontStyle: v.driver ? "normal" : "italic",
                    }}
                  >
                    {v.driver ?? "Unassigned"}
                  </td>

                  {/* Location */}
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 12,
                      color: dark ? C.gray7B : C.lightSubtext,
                    }}
                  >
                    {v.location}
                  </td>

                  {/* Battery */}
                  <td style={{ padding: "10px 12px" }}>
                    <div
                      style={{
                        width: 80,
                        height: 5,
                        borderRadius: 3,
                        background: dark ? C.darkBorder : C.grayE6,
                        overflow: "hidden",
                        marginBottom: 3,
                      }}
                    >
                      <div
                        style={{
                          width: `${v.battery}%`,
                          height: "100%",
                          background: batColor,
                          borderRadius: 3,
                          transition: "width .6s ease",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: batColor }}>
                      {v.battery}%
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "10px 12px" }}>
                    <button
                      style={{
                        color: dark ? C.gray7B : C.lightSubtext,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <MoreVertical size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setShowAll((p) => !p)}
        className="w-full py-3 border-t text-xs font-semibold tracking-widest uppercase transition-colors"
        style={{
          borderColor: dark ? C.darkBorder : C.lightBorder,
          color: dark ? C.gray7B : C.lightSubtext,
          background: "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.primaryPurple)}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = dark ? C.gray7B : C.lightSubtext)
        }
      >
        {showAll ? "Show Less" : "See All Vehicles"}
      </button>
    </div>
  );
}
