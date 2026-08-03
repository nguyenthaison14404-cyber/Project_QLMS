const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/theoDoiMuonSach.controller');

router.get('/', ctrl.getAll);
router.post('/', ctrl.muonSach); // ⚡ Sửa '/muon' thành '/'
router.put('/tra/:id', ctrl.traSach);
router.delete('/:id', ctrl.delete);

module.exports = router;