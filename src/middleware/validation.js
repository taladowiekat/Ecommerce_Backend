export const validation = (schema, reqPart = 'body') => {
    return (req, res, next) => {
        const errorMessage = [];
        let filterData = {};

        // تأكد من أن schema غير undefined
        if (!schema || !schema.validate) {
            return res.status(500).json({ message: "Schema validation function not found." });
        }

        // تجميع البيانات للتحقق
        if (req.file) {
            filterData = { image: req.file, ...req.body, ...req.params, ...req.query };
        } else if (req.files) {
            filterData = { ...req.files, ...req.body, ...req.params, ...req.query };
        } else {
            filterData = { ...req.body, ...req.params, ...req.query };
        }

        // تنفيذ التحقق
        const { error } = schema.validate(filterData, { abortEarly: false });
        if (error) {
            error.details.forEach(err => {
                const key = err.context.key;
                errorMessage.push({ [key]: err.message });
            });
            return res.status(400).json({ message: "validation error", error: errorMessage });
        }

        next();
    };
};
