function VoucherModal({ pendingVoucher, setShowVoucherModal, confirmVoucherRedemption, cardClass }) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
            <div className={`w-full max-w-sm p-6 rounded-3xl border text-center space-y-4 ${cardClass}`}>
                <h3 className="font-black text-lg tracking-tight">Confirmar Troca</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Deseja converter {pendingVoucher.cost} pontos em um código único de cupom para a recompensa "{pendingVoucher.name}"?</p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button onClick={() => setShowVoucherModal(false)} className="p-2.5 bg-zinc-800 text-white font-bold text-xs rounded-xl cursor-pointer">Cancelar</button>
                    <button onClick={confirmVoucherRedemption} className="p-2.5 bg-emerald-500 text-black font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-emerald-500/10">Confirmar</button>
                </div>
            </div>
        </div>
    );
}