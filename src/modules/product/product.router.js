import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    return res.json({ message: "success" });
});

export default router;
