import { Icon, Badge } from "@components";
import { requestType } from "@utils/format";
import type { DocumentRequest } from "@types";
import "./RequestRow.css";

type RequestRowProps = {
  request: DocumentRequest;
  onClick: (request: DocumentRequest) => void;
};

export function RequestRow({ request, onClick }: RequestRowProps) {
  const type = requestType(request);
  return (
    <tr
      className="request-row"
      role="button"
      tabIndex={0}
      onClick={() => onClick(request)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(request);
        }
      }}
    >
      <td>
        {request.email_trimis ? (
          <span className="request-row__status request-row__status--ok">
            <Icon name="check-circle-2" size={14} /> trimis
          </span>
        ) : (
          <span className="request-row__status request-row__status--err" title={request.eroare}>
            <Icon name="alert-circle" size={14} /> esuat
          </span>
        )}
      </td>
      <td className="request-row__client">{request.client}</td>
      <td className="request-row__subject">{request.subiect}</td>
      <td>
        <Badge variant="mono">{request.period}</Badge>
      </td>
      <td>
        <span className={`request-row__type request-row__type--${type}`}>{type}</span>
      </td>
      <td className="request-row__by">{request.created_by}</td>
      <td className="request-row__date">{request.created}</td>
    </tr>
  );
}
