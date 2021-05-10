# perf-analytics-tool


### Install
```javascript
npm install measure-browser-performance
```

Client Side
```javascript
import MeasureBrowserPerformance from "measure-browser-performance";
const PerformanceMetricAnalyser = MeasureBrowserPerformance(YOUR_SERVICE_ENDPOINT);
```

Performance analytic tools is a library to measure / calculate 
* FCP (First Contentful Paint)
* TTFB (Time to First Byte),
* DOM_LOAD
* WINDOW_LOAD 
* RESOURCES
* Timing for Document, Image, Font, Js and Css




### FCP (First Contentful Paint)

The First Contentful Paint (FCP) metric measures the time from when the page starts loading to when any part of the page's content is rendered on the screen

```javascript
const getFCP = () => {
    const contentPaint = performance
        .getEntries()
        .find(entry => entry.name === 'first-contentful-paint');

    return contentPaint ? contentPaint.startTime : 0;
}
```

### TTFB(Time to First Byte)

Time to first byte (TTFB) is a metric for determining the responsiveness of a web server. It measures the amount of time between creating a connection to the server and downloading the contents of a web page.
```javascript
const getTTFB = (timing) => timing.responseStart - timing.requestStart
```

### DOM LOAD

Dom Load Time represents the time from page initialization to the DomContentLoaded event or, for older Internet Explorer browsers, to the time the DOM is "interactive".
```javascript
const getDomLoad = (timing) => Math.round(timing.domContentLoadedEventEnd - timing.navigationStart)
```




### WINDOW LOAD

The load event is fired when the whole page has loaded, including all dependent resources such as stylesheets and images. This is in contrast to DOMContentLoaded , which is fired as soon as the page DOM has been loaded, without waiting for resources to finish loading.
```javascript
const getWindowLoad = (timing) => Math.round(timing.loadEventStart - timing.navigationStart);
```


storeData method consumes the endpoint which is declared on initialization with the measured performance data to store it.
```javascript
const storeData = async (endpoint, body) => {
    return await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then(responseJson => responseJson);
};

```

### RESOURCE LOAD

The Resource load measures the metrics of static files uploaded in/by web page .
```javascript
const getResourceLoad = () => {
    const resourceLoad = performance
        .getEntriesByType('resource')
        .reduce((acc, resource) => acc + (resource.responseEnd - resource.startTime), 0);

    return Math.round(resourceLoad);
};
```

Measure Network Timing for Document, Image, Font, Js and Css
```javascript
const getFiles = () => window.performance
    .getEntriesByType('resource')
    .map(entry => getTimingFromEntry(entry))
```


### PERFORMANCE ANALYSER

Performance Analyser accept and endpoint which represents url to store calculated metrics of the web page. it's triggered by [window:onLoad event](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event) and consumes the dynamic endpoint which is defined by it's own initialization with calculated metrics .
```javascript
const measureBrowserPerformance = (endpoint, showMeasureTime = true) => ({
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

            if (showMeasureTime){
                console.log("metrics measured in " + (endTime - startTime) + " milliseconds.")
            }

            storeData(endpoint, values).then(response => response);
        };
    }
});
```


### MEASUREMENT TIME

Calculates measurement time . You can observe measurement time in your browser console.
```javascript

      const startTime = performance.now()

      const values = {
                resource_load: getResourceLoad(),
                files: getFiles(),
                fcp: getFCP(),
                ttfb: getTTFB(timing),
                dom_load: getDomLoad(timing),
                window_load: getWindowLoad(timing),
                domain: window.location.hostname
            };
        const endTime = performance.now();

        console.log("metrics measured in " + (endTime - startTime) + " milliseconds.")
```

Parameters:

| Parameter                 | Default       | Required  | Description   |	
| :------------------------ |:-------------:|:-------------:| :-------------|
| endpoint 	     |           |YES | endpoint to consume with measured params
| showMeasureTime| true           |NO | consider to see measurement time in your console.

