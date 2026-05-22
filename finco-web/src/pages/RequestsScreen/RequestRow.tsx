import { Icon } from "../../components/Icon/Icon";
import { Badge } from "../../components/Badge/Badge";
import { requestType } from "../../utils/format";
import type { DocumentRequest } from "../../types";
import "./RequestRow.css";

export function RequestRow({ request }: { request: DocumentRequest }) {
  const type = requestType(request);
  return (
    <tr className="request-row">
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
