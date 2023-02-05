const gptSampleData = {
    "categories": [
        "Shirts",
        "Pants",
        "Footwear"
    ],
    "products": [
        {
            "title": "A business Shirt",
            "description": "This breathable and comfortable business shirt is made of light fabric, perfect for long and hot days in the office.",
            "tags": [
                "Shirt"
            ],
            "price": "49.99",
            "compareAtPrice": "",
            "options": [
                {
                    "name": "size",
                    "values": [
                        "s",
                        "m",
                        "l"
                    ]
                },
                {
                    "name": "colour",
                    "values": [
                        "green",
                        "yellow",
                        "blue"
                    ]
                }
            ],
            "vendor": "Ralph Lauren",
            "productType": "shirt",
            "requiresShipping": true,
            "weight": 400,
            "weightUnit": "g",
            "dallePrompt":"A man wearing a crisp, white business shirt, standing in a relaxed yet professional pose against a neutral background with a clear focus on the shirt's fabric, highlighting its lightweight and breathable qualities, perfect for a hot day in the office."
        },
        {
            "title": "Basic Summer Pants Collection",
            "description": "Enjoy the summer weather in these basic pants!",
            "tags": [
                "Pants"
            ],
            "price": "79.99",
            "compareAtPrice": "89.99",
            "options": [
                {
                    "name": "length",
                    "values": [
                        "Regular",
                        "Short",
                        "Long"
                    ]
                },
                {
                    "name": "style",
                    "values": [
                        "Flared",
                        "Slim-Fit"
                    ]
                }
            ],
            "vendor": "Cotton On",
            "productType": "pants",
            "requiresShipping": false,
            "weight": 0,
            "weightUnit": "g",
            "dallePrompt":"A professional product photo of the basic pants on a white background, with a focus on the material, color and design details, such as the waistband and pockets, to showcase the quality and versatility of the pants as a summer essential."
        },
        {
            "title": "Studded Leather Shoes For Men",
            "description": "These studded leather shoes will give any man a classic look.",
            "tags": [
                "Footwear"
            ],
            "price": "119.99",
            "compareAtPrice": "",
            "options": [
                {
                    "name": "width",
                    "values": [
                        "wide",
                        "normal",
                        "narrow"
                    ]
                }
            ],
            "vendor": "Shirley Shoes",
            "productType": "footwear",
            "requiresShipping": true,
            "weight": 1000,
            "weightUnit": "g",
            "dallePrompt":"A product photo of a black studded leather shoes for men, positioned at a slight angle on a white background with the stud details clearly visible and emphasis on the high-quality leather texture."
        },
        {
            "title": "Cotton Blouse With Ruffles",
            "description": "A perfect feminine blouse for special occasions.",
            "tags": [
                "Shirt"
            ],
            "price": "69.99",
            "compareAtPrice": "",
            "options": [
                {
                    "name": "size",
                    "values": [
                        "s",
                        "m",
                        "l"
                    ]
                },
                {
                    "name": "colour",
                    "values": [
                        "red",
                        "pink",
                        "black"
                    ]
                }
            ],
            "vendor": "Shein",
            "productType": "blouse",
            "requiresShipping": true,
            "weight": 300,
            "weightUnit": "g",
            "dallePrompt":"A product photo of a feminine cotton blouse with ruffles, that would be worn on a special occasion, set against a white background."
        },
        {
            "title": "Funky Printed Jeans For Women",
            "description": "Make a statement with these funky printed jeans!",
            "tags": [
                "Pants"
            ],
            "price": "59.99",
            "compareAtPrice": "74.99",
            "options": [
                {
                    "name": "length",
                    "values": [
                        "Regular",
                        "Capri"
                    ]
                }
            ],
            "vendor": "Levi's",
            "productType": "jeans",
            "requiresShipping": true,
            "weight": 800,
            "weightUnit": "g",
            "dallePrompt":"A product photo of funky printed jeans for women that can be worn to make a statement. Shot on a white background in a studio"
        }
    ]
};

export default gptSampleData;