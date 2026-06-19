const Nutritionist = require('../models/Nutritionist');

// Get all nutritionists
exports.getAllNutritionists = async (req, res) => {
    try {
        const nutritionists = await Nutritionist.find();
        res.status(200).json(nutritionists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get nutritionist by ID
exports.getNutritionistById = async (req, res) => {
    try {
        const nutritionist = await Nutritionist.findById(req.params.id);
        if (!nutritionist) {
            return res.status(404).json({ message: 'Nutritionist not found' });
        }
        res.status(200).json(nutritionist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new nutritionist
exports.createNutritionist = async (req, res) => {
    try {
        const nutritionist = new Nutritionist(req.body);
        const savedNutritionist = await nutritionist.save();
        res.status(201).json(savedNutritionist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update nutritionist
exports.updateNutritionist = async (req, res) => {
    try {
        const nutritionist = await Nutritionist.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!nutritionist) {
            return res.status(404).json({ message: 'Nutritionist not found' });
        }
        res.status(200).json(nutritionist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete nutritionist
exports.deleteNutritionist = async (req, res) => {
    try {
        const nutritionist = await Nutritionist.findByIdAndDelete(req.params.id);
        if (!nutritionist) {
            return res.status(404).json({ message: 'Nutritionist not found' });
        }
        res.status(200).json({ message: 'Nutritionist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add review to nutritionist
exports.addReview = async (req, res) => {
    try {
        const nutritionist = await Nutritionist.findById(req.params.id);
        if (!nutritionist) {
            return res.status(404).json({ message: 'Nutritionist not found' });
        }

        const review = {
            user: req.user._id,
            rating: req.body.rating,
            comment: req.body.comment
        };

        nutritionist.reviews.push(review);
        
        // Update average rating
        const totalRating = nutritionist.reviews.reduce((sum, review) => sum + review.rating, 0);
        nutritionist.rating = totalRating / nutritionist.reviews.length;

        await nutritionist.save();
        res.status(200).json(nutritionist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 