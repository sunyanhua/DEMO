/**
 * 常聚 AA 账本引擎（纯函数，不可变返回新对象）
 */
window.Settle = (function () {
    function round2(x) { return Math.round(x * 100) / 100; }

    // 追加一笔账（返回新 bill，不修改入参）
    function addEntry(bill, entry) {
        return {
            ...bill,
            entries: [...(bill.entries || []), { id: 'e-' + Date.now().toString(36), ...entry }]
        };
    }

    // 分账：pay=垫付总额，receive=应摊总额（每笔按 participants 平分，四舍五入到分）
    function computeShares({ entries, memberIds }) {
        const shares = {};
        (memberIds || []).forEach(id => { shares[id] = { pay: 0, receive: 0 }; });
        (entries || []).forEach(e => {
            const n = (e.participants || []).length;
            if (n === 0) return;
            if (!shares[e.payerId]) shares[e.payerId] = { pay: 0, receive: 0 };
            shares[e.payerId].pay = round2(shares[e.payerId].pay + e.amount);
            const per = round2(e.amount / n);
            e.participants.forEach(p => {
                if (!shares[p]) shares[p] = { pay: 0, receive: 0 };
                shares[p].receive = round2(shares[p].receive + per);
            });
        });
        return shares;
    }

    // 债务合并：最少转账笔数（最大应收/应付贪心对冲），返回 [{from,to,amount}]
    function consolidate(balances) {
        let creditors = [], debtors = [];
        Object.entries(balances || {}).forEach(([id, b]) => {
            const net = round2(b.pay - b.receive); // 正=应收，负=应付
            if (net > 0) creditors.push({ id, net });
            else if (net < 0) debtors.push({ id, net: -net });
        });
        const transfers = [];
        creditors.sort((a, b) => b.net - a.net);
        debtors.sort((a, b) => b.net - a.net);
        let i = 0, j = 0;
        while (i < creditors.length && j < debtors.length) {
            const amt = round2(Math.min(creditors[i].net, debtors[j].net));
            if (amt > 0) transfers.push({ from: debtors[j].id, to: creditors[i].id, amount: amt });
            creditors[i].net = round2(creditors[i].net - amt);
            debtors[j].net = round2(debtors[j].net - amt);
            if (creditors[i].net <= 0) i++;
            if (debtors[j].net <= 0) j++;
        }
        return transfers;
    }

    // 随机买单（rng 注入）
    function drawPayer({ memberIds, rng }) {
        const ids = memberIds || [];
        if (ids.length === 0) return null;
        const idx = Math.min(ids.length - 1, Math.floor((rng() || 0) * ids.length));
        return ids[idx];
    }

    // 账单三态：无结清标记→pending；全员结清→settled；其余 partial
    function billState({ bill, settled }) {
        const marks = settled || bill.settled || {};
        const participants = new Set();
        (bill.entries || []).forEach(e => (e.participants || []).forEach(p => participants.add(p)));
        if (participants.size === 0) return 'pending';
        const done = [...participants].filter(p => marks[p]).length;
        if (done === 0) return 'pending';
        if (done === participants.size) return 'settled';
        return 'partial';
    }

    return { addEntry, computeShares, consolidate, drawPayer, billState };
})();
