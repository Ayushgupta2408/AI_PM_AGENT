export default function History({ items, onSelect }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="history">
      <div className="history-label">Recent specs</div>
      <div className="history-list">
        {items.map((item) => (
          <button key={item._id} className="history-item" onClick={() => onSelect(item._id)}>
            {item.title || item.prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
