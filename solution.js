class IntensityManager {
    /**
     * Initializes a new instance of the IntensityManager class.
     */
    constructor() {
        this.changes = new Map();
    }

    /**
     * Adds an intensity change over a specified range.
     * @param {number} from - The starting point of the range.
     * @param {number} to - The ending point of the range.
     * @param {number} amount - The amount of intensity change.
     * @returns {Array} An array of intensity segments.
     */
    add(from, to, amount) {
        this.validateInput(from, to, amount);
        this.changes.set(from, (this.changes.get(from) || 0) + amount);
        this.changes.set(to, (this.changes.get(to) || 0) - amount);
        this.cleanChanges();
        return this.getSegments();
    }

    /**
     * Sets an exact intensity value over a specified range.
     * @param {number} from - The starting point of the range.
     * @param {number} to - The ending point of the range.
     * @param {number} amount - The exact intensity value to set.
     * @returns {Array} An array of intensity segments.
     */
    set(from, to, amount) {
        this.validateInput(from, to, amount);

        // Get all unique points (both start and end) sorted
        const segments = this.getSegments();

        let fromIntensity = 0;
        let toIntensity = 0;

        segments.forEach((curSegment, i) => {
            if (i !== segments.length - 1) {
                const nextSegment = segments[i + 1];
                const left = curSegment[0];
                const right = nextSegment[0];

                if (left <= from && from < right) {
                    fromIntensity = curSegment[1];
                }

                if (left <= to && to < right) {
                    toIntensity = curSegment[1];
                }
            }
        });

        this.changes.set(from, amount - fromIntensity);
        this.changes.set(to, -amount + toIntensity);
        this.cleanChanges();

        Array.from(this.changes.keys())
            .filter(point => from < point && point < to)
            .forEach(point => this.changes.delete(point));

        return this.getSegments();
    }

    /**
     * Calculates and returns the intensity segments.
     * @returns {Array} An array of intensity segments.
     */
    getSegments() {
        const result = [];
        let intensity = 0;
        const points = Array.from(this.changes.keys()).sort((a, b) => a - b);

        points.forEach((point, i) => {
            intensity += this.changes.get(point) || 0;
            if (intensity !== 0 || (i > 0 && this.changes.get(points[i - 1]) !== 0)) {
                result.push([point, intensity]);
            }
        });

        return result;
    }

    /**
     * Cleans up the changes map by removing entries with zero changes.
     */
    cleanChanges() {
        Array.from(this.changes.keys()).forEach(point => {
            if (this.changes.get(point) === 0) {
                this.changes.delete(point);
            }
        });
    }

    /**
   * Clears all intensity changes.
   */
    clear() {
        this.changes.clear(); // This will remove all entries from the map.
    }

    /**
     * Validates the input for range and intensity.
     * @param {number} from - The starting point of the range.
     * @param {number} to - The ending point of the range.
     * @param {number} amount - The intensity amount.
     */
    validateInput(from, to, amount) {
        if (typeof from !== 'number' || typeof to !== 'number' || typeof amount !== 'number') {
            throw new Error('Invalid input: from, to, and amount must be numbers');
        }
        if (from >= to) {
            throw new Error('Invalid range: from must be less than to');
        }
    }
}

// Example usage
try {
    const intensityManager = new IntensityManager();
    console.log('Add 1 from 10 to 30:', intensityManager.add(10, 30, 1));
    console.log('Add 1 from 20 to 40:', intensityManager.add(20, 40, 1));
    console.log('Add -1 from 10 to 40:', intensityManager.add(10, 40, -2));
    console.log('Set 10 from 25 to 35:', intensityManager.set(25, 35, 10));
    console.log('Final segments:', intensityManager.getSegments());
} catch (error) {
    console.error('Error:', error.message);
}
