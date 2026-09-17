const Partner = require("../../models/partner.model");
const { success, error } = require("../../utils/response");

exports.getPartners = async (req, res) => {
    try {
        const partners = await Partner.find()
            .sort({ createdAt: -1 })

        return success(res, "Partners fetched successfully", partners);
    } catch (err) {
        console.log("Get partners error:", err);
        return error(res, 500, "Internal Server Error");
    }
}

exports.createPartner = async (req, res) => {
    try {
        const {
            name,
            code,
            type,
            logo,
            status,
        } = req.body;

        if (!name || !code || !type) {
            return error(res, 400, "Name, code and type are required");
        }

        if (!["Bank", "NBFC"].includes(type)) {
            return error(res, 400, "Invalid partner type");
        }

        const normalizedCode = code.trim().toUpperCase();

        const existingPartner = await Partner.findOne({
            code: normalizedCode
        });

        if (existingPartner) {
            return error(res, 409, "Partner with this code already exists");
        }

        const partner = await Partner.create({
            name: name.trim(),
            code: normalizedCode,
            type,
            logo: logo || "",
            status: status || "active",
        });

        return success(res, "Partner created successfully", partner);
    } catch (err) {
        console.log("Create partner error:", err);
        if (err.code === 11000) {
            return error(res, 409, "Partner with this code already exists");
        }

        return error(res, 500, "Internal Server Error");
    }
};

exports.updatePartner = async (req, res) => {
    try {
        const { id } = req.params;

        const partner = await Partner.findById(id);

        if (!partner) {
            return error(res, 404, "Partner not found");
        }

        const {
            name,
            code,
            type,
            logo,
        } = req.body;

        if (type !== undefined && !["Bank", "NBFC"].includes(type)) {
            return error(res, 400, "Invalid partner type");
        }

        if (name !== undefined) {
            partner.name = name.trim();
        }

        if (code !== undefined) {
            const normalizedCode = code.trim().toUpperCase();

            const existingPartner = await Partner.findOne({
                code: normalizedCode,
                _id: { $ne: id },
            });

            if (existingPartner) {
                return error(res, 409, "Partner with this code already exists");
            }

            partner.code = normalizedCode;
        }

        if (type !== undefined) {
            partner.type = type;
        }

        if (logo !== undefined) {
            partner.logo = logo;
        }

        await partner.save();

        return success(res, "Partner updated successfully", partner);

    } catch (err) {
        console.log("Update partner error:", err);

        if (err.name === "CastError") {
            return error(res, 400, "Invalid partner ID");
        }

        if (err.code === 11000) {
            return error(res, 409, "Partner with this code already exists");
        }

        return error(res, 500, "Internal Server Error");
    }
};

exports.updatePartnerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["active", "inactive"].includes(status)) {
            return error(res, 400, "Invalid partner status");
        }

        const partner = await Partner.findByIdAndUpdate(
            id,
            { status },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!partner) {
            return error(res, 404, "Partner not found");
        }

        return success(
            res,
            "Partner status updated successfully",
            partner
        );
    } catch (err) {
        console.log("Update partner status error:", err);

        if (err.name === "CastError") {
            return error(res, 400, "Invalid partner ID");
        }

        return error(res, 500, "Internal Server Error");
    }
};

exports.deletePartner = async (req, res) => {
    try {
        const { id } = req.params;
        const partner = await Partner.findByIdAndDelete(id);

        if (!partner) {
            return error(res, 404, "Partner not found");
        }

        return success(res, "Partner deleted successfully", partner);
    } catch (err) {
        console.log("Delete partner error:", err);
        if (err.name === "CastError") {
            return error(res, 400, "Invalid partner ID");
        }
        return error(res, 500, "Internal Server Error");
    }
};