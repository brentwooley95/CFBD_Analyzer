// utils/colorHelpers.js
export const getColorClass = (value, isSuccessRate = false, reverseScale = false) => {
    let thresholds;

     const applyTextColor = (bgClass) => {
        // Apply white text to darker backgrounds
        const darkBackgrounds = ["bg-success", "bg-danger"];
        return darkBackgrounds.includes(bgClass) ? `${bgClass} text-white` : bgClass;
    };


    if (isSuccessRate) {
        thresholds = reverseScale
            ? [
                  { limit: 0.3619, color: "bg-success" },
                  { limit: 0.3989, color: "bg-success-subtle" },
                  { limit: 0.4449, color: "bg-warning-subtle" },
                  { limit: 0.4799, color: "bg-danger-subtle" },
                  { limit: Infinity, color: "bg-danger" }
              ]
            : [
                  { limit: 0.3619, color: "bg-danger" },
                  { limit: 0.3989, color: "bg-danger-subtle" },
                  { limit: 0.4449, color: "bg-warning-subtle" },
                  { limit: 0.4799, color: "bg-success-subtle" },
                  { limit: Infinity, color: "bg-success" }
              ];
    } else {
        thresholds = [
            { limit: 32.99, color: "bg-danger" },
            { limit: 41.99, color: "bg-danger-subtle" },
            { limit: 56.99, color: "bg-warning-subtle" },
            { limit: 69.99, color: "bg-success-subtle" },
            { limit: Infinity, color: "bg-success" }
        ];
    }

    return thresholds.find(t => value < t.limit)?.color || "";
};
