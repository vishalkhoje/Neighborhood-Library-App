export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white', padding: '24px', borderRadius: '12px',
                maxWidth: '400px', width: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1.25rem' }}>{title}</h3>
                <p style={{ marginBottom: '24px', color: '#4b5563', fontSize: '0.9rem' }}>{message}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-danger" onClick={() => {
                        onConfirm();
                        onClose();
                    }}>Confirm</button>
                </div>
            </div>
        </div>
    );
}
