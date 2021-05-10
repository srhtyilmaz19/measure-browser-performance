const getFCP = () => {
    const contentPaint = window.performance
        .getEntriesByType('paint')
        .find(entry => entry.name === 'first-contentful-paint');

    return contentPaint ? Math.round(contentPaint.startTime) : 0;
}

const getTTFB = (timing) => timing.responseStart - timing.requestStart

const getDomLoad = (timing) => Math.round(timing.domContentLoadedEventEnd - timing.navigationStart)

const getWindowLoad = (timing) => Math.round(timing.loadEventStart - timing.navigationStart);

const getTimingFromEntry = entry => ({
    name: entry.name,
    type: entry.initiatorType,
    end: Math.round(entry.responseEnd)
})

const getFiles = () => window.performance
    .getEntriesByType('resource')
    .map(entry => getTimingFromEntry(entry))

const storeData = async (endpoint, body) => {
    return await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then(responseJson => responseJson);
};

const getResourceLoad = () => {
    const resourceLoad = window.performance
        .getEntriesByType('resource')
        .reduce((acc, resource) => acc + (resource.responseEnd - resource.startTime), 0);

    return Math.round(resourceLoad);
};


const measureBrowserPerformance = (endpoint) => ({
    analyse() {
        if (!endpoint) throw new Error('endpoint parameter is required !');

        window.onload = () => {
            const {performance: {timing}} = window

            const startTime = performance.now()

            const values = {
                resource_load: getResourceLoad(),
                files: getFiles(),
                fcp: getFCP(),
                ttfb: getTTFB(timing),
                dom_load: getDomLoad(timing),
                window_load: getWindowLoad(timing),
                domain: window.location.hostname
            }


            const endTime = performance.now()

            console.log("metrics measured in " + (endTime - startTime) + " milliseconds.")

            storeData(endpoint, values).then(response => response);
        };
    }
});

export default measureBrowserPerformance;

export {measureBrowserPerformance};
