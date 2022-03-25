import ReactDOM from "react-dom";

function Modal({ children }) {

    return ReactDOM.createPortal(
        <div style={{
            top: '0', left: '0', bottom: '0', right: '0',
            position: 'fixed', background: 'rgb(0,0,0,0.5)', zIndex: '1000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onMouseDown={e => {
            e.stopPropagation()
        }
        }>
            <div style={{ background: 'white', borderRadius: '5px', width: '450px', height: '300px' }}>
                {children}
            </div>
        </div>,
        document.body
    )
}
export default Modal;
