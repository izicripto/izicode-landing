// Rodar com: node --test functions/cupons.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { avaliarCupom, normalizarCodigo } = require('./cupons');

const base = { ativo: true, tipo: 'percentual', valor: 20, planos: [], validoAte: null, usosMax: null, usos: 0 };
const pro = { plan: 'pro_mensal', precoCentavos: 3990, agoraMs: Date.UTC(2026, 9, 3) };

test('percentual aplica o desconto e arredonda', () => {
    assert.deepEqual(avaliarCupom(base, pro), { ok: true, descontoCentavos: 798, precoFinalCentavos: 3192 });
});

test('valor fixo abate centavos', () => {
    const r = avaliarCupom({ ...base, tipo: 'valor', valor: 1000 }, pro);
    assert.deepEqual(r, { ok: true, descontoCentavos: 1000, precoFinalCentavos: 2990 });
});

test('nunca deixa o preço abaixo de R$ 1,00', () => {
    assert.equal(avaliarCupom({ ...base, valor: 100 }, pro).precoFinalCentavos, 100);
    assert.equal(avaliarCupom({ ...base, tipo: 'valor', valor: 99999 }, pro).precoFinalCentavos, 100);
});

test('recusa cupom desativado, expirado, esgotado ou de outro plano', () => {
    assert.equal(avaliarCupom({ ...base, ativo: false }, pro).ok, false);
    assert.equal(avaliarCupom(null, pro).ok, false);
    assert.equal(avaliarCupom({ ...base, validoAte: Date.UTC(2026, 8, 1) }, pro).motivo, 'Este cupom expirou.');
    assert.equal(avaliarCupom({ ...base, usosMax: 5, usos: 5 }, pro).ok, false);
    assert.equal(avaliarCupom({ ...base, planos: ['escola'] }, pro).ok, false);
    assert.equal(avaliarCupom({ ...base, planos: ['pro_mensal'] }, pro).ok, true);
});

test('aceita validade como Timestamp do Firestore', () => {
    const ts = { toMillis: () => Date.UTC(2026, 11, 31) };
    assert.equal(avaliarCupom({ ...base, validoAte: ts }, pro).ok, true);
});

test('recusa tipo ou valor malformado', () => {
    assert.equal(avaliarCupom({ ...base, valor: 0 }, pro).ok, false);
    assert.equal(avaliarCupom({ ...base, valor: 150 }, pro).ok, false);
    assert.equal(avaliarCupom({ ...base, tipo: 'outro' }, pro).ok, false);
});

test('normaliza e valida o código', () => {
    assert.equal(normalizarCodigo('  volta-as-aulas '), 'VOLTA-AS-AULAS');
    assert.equal(normalizarCodigo('ab'), null);
    assert.equal(normalizarCodigo('com espaço'), null);
    assert.equal(normalizarCodigo('../users'), null);
    assert.equal(normalizarCodigo(42), null);
});
