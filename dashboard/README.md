```
python -m SimpleHTTPServer 3000
```

### Average
1. The time complexity of the moving average function is O(n) for `get_moving_average` due to use of the sum function as well as the list slice.
2. The time complexity could be improved to O(1) if the n parameter was not required as we could then just collect the sum by addition in the `add_vaue` function.

### API Suggestions
1. The data structures returned by the API could pretty much be the exact structure used by highcharts in this example page. Other than that I would implement a simple HTTP service.
```
GET https://client_id:api_token@api.service.com/conversions/?days=7

200 OK
[
    {
        "name": "Steps",
        "colorByPoint": true,
        "data": [
            {
                "name": "Registered",
                "y": 55
            },
            {
                "name": "Created Project",
                "y": 33
            },
            {
                "name": "Live Data Received",
                "y": 4
            },
            {
                "name": "Action",
                "y": 3
            }
        ]
    }
]
```

### UI Improvements
1. The first graph could be an area graph as it might better get across the idea of a conversion funnel.
2. I would rely less on hovering over small objects on the screen, this can be problematic particularly for mobile users and is also less useful in a presentation than simply taking up the extra space of presenting the information on screen.