define([], function() {

    'use strict'
    var defaults = [

    /* Default Json 1*/
        {
            "id": "root",
            "children": [
                {
                    "id": "a",
                    "pid": "root",
                    "children": [
                        {
                            "id": "b",
                            "pid": "a",
                            "children": [
                                {
                                    "id": "b1",
                                    "pid": "b",
                                    "children": [
                                        {
                                            "id": "bb",
                                            "pid": "b1",
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "c",
                            "pid": "a",
                            "children": [
                                {
                                    "id": "c1",
                                    "pid": "c",
                                    "children": [
                                        {
                                            "id": "cc1",
                                            "pid": "c1",
                                            "children": []
                                        }
                                    ]
                                },
                                {
                                    "id": "c2",
                                    "pid": "c",
                                    "children": [
                                        {
                                            "id": "cc2",
                                            "pid": "c2",
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "d",
                    "pid": "root",
                    "children": [
                        {
                            "id": "e",
                            "pid": "d",
                            "children": [
                                {
                                    "id": "e1",
                                    "pid": "e",
                                    "children": [
                                        {
                                            "id": "ee",
                                            "pid": "e1",
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "f",
                            "pid": "d",
                            "children": [
                                {
                                    "id": "f1",
                                    "pid": "f",
                                    "children": [
                                        {
                                            "id": "ff1",
                                            "pid": "f1",
                                            "children": []
                                        }
                                    ]
                                },
                                {
                                    "id": "f2",
                                    "pid": "f",
                                    "children": [
                                        {
                                            "id": "ff2",
                                            "pid": "f2",
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },

    /* Default Json 2*/
        {
            "children": [
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "children": [],
                                    "id": "ec57ee47-3bcc-7ebc-39e8-6c3e45a3b5f1",
                                    "pid": "7c6bfc80-4f30-9797-674b-1aafc21c580c"
                                },
                                {
                                    "children": [],
                                    "id": "dabbf095-b871-7ce5-0932-7cc5ec3555de",
                                    "pid": "7c6bfc80-4f30-9797-674b-1aafc21c580c"
                                },
                                {
                                    "children": [],
                                    "id": "5cfaa8ab-6fb7-445e-18c4-d154a3bb2138",
                                    "pid": "7c6bfc80-4f30-9797-674b-1aafc21c580c"
                                },
                                {
                                    "children": [],
                                    "id": "4bdfa1c2-2da9-5923-87fe-1218a903e42e",
                                    "pid": "7c6bfc80-4f30-9797-674b-1aafc21c580c"
                                }
                            ],
                            "id": "7c6bfc80-4f30-9797-674b-1aafc21c580c",
                            "pid": "a3a5ce89-6e89-1a7f-61f1-fab405826a29"
                        },
                        {
                            "children": [
                                {
                                    "children": [],
                                    "id": "a7671e57-cea4-d099-b296-7eff096a1a93",
                                    "pid": "668d360c-eb24-23b5-fc25-d6f9c9a6add6"
                                },
                                {
                                    "children": [],
                                    "id": "d95364db-3093-48d2-e31d-2d4aee5d28dd",
                                    "pid": "668d360c-eb24-23b5-fc25-d6f9c9a6add6"
                                }
                            ],
                            "id": "668d360c-eb24-23b5-fc25-d6f9c9a6add6",
                            "pid": "a3a5ce89-6e89-1a7f-61f1-fab405826a29"
                        },
                        {
                            "children": [
                                {
                                    "children": [],
                                    "id": "933c7997-1c44-b3ab-88ac-af446adf885d",
                                    "pid": "0933acb8-7c48-3f70-3c17-37679fc8123a"
                                }
                            ],
                            "id": "0933acb8-7c48-3f70-3c17-37679fc8123a",
                            "pid": "a3a5ce89-6e89-1a7f-61f1-fab405826a29"
                        }
                    ],
                    "id": "a3a5ce89-6e89-1a7f-61f1-fab405826a29",
                    "pid": "root"
                }
            ],
            "id": "root",
            "pid": -1
        },

    /* Default Json 3*/
        {
            "id": "root",
            "children": [
                {
                    "id": "e",
                    "pid": "root",
                    "children": [
                        {
                            "id": "a",
                            "pid": "e",
                            "children": [   ]
                        },
                        {
                            "id": "d",
                            "pid": "e",
                            "children": [
                                {
                                    "id": "b",
                                    "pid": "d",
                                    "children": [   ]
                                },
                                {
                                    "id": "c",
                                    "pid": "d",
                                    "children": [   ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "f",
                    "pid": "root",
                    "children": [   ]
                },
                {
                    "id": "n",
                    "pid": "root",
                    "children": [
                        {
                            "id": "g",
                            "pid": "n",
                            "children": [   ]
                        },
                        {
                            "id": "m",
                            "pid": "n",
                            "children": [
                                {
                                    "id": "h",
                                    "pid": "m",
                                    "children": []
                                },
                                {
                                    "id": "i",
                                    "pid": "m",
                                    "children": []
                                },
                                {
                                    "id": "j",
                                    "pid": "m",
                                    "children": []
                                },
                                {
                                    "id": "k",
                                    "pid": "m",
                                    "children": []
                                },
                                {
                                    "id": "l",
                                    "pid": "m",
                                    "children": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },

    /* Default Json 4*/
        {"id":"root","children":[{"id":"129e0375-c786-c4bc-e6dd-fb977595269b","pid":"root","children":[{"id":"d6c7c785-b847-bb88-f9e9-8492ff00c3f6","pid":"129e0375-c786-c4bc-e6dd-fb977595269b","children":[{"id":"5e928938-a096-9918-d6de-26cdca9667a7","pid":"d6c7c785-b847-bb88-f9e9-8492ff00c3f6","children":[{"id":"eac9ef16-f2cc-d5f5-4887-27cf92a834c1","pid":"5e928938-a096-9918-d6de-26cdca9667a7","children":[{"id":"009a2098-81c3-48f9-d987-f17ff6c566fa","pid":"eac9ef16-f2cc-d5f5-4887-27cf92a834c1","children":[]},{"id":"9f88473e-5cf9-5d36-6562-b21f33035acd","pid":"eac9ef16-f2cc-d5f5-4887-27cf92a834c1","children":[]},{"id":"50e68a77-8ea5-f620-49e5-c765a4df8917","pid":"eac9ef16-f2cc-d5f5-4887-27cf92a834c1","children":[]}]},{"id":"80af7188-e069-4670-ff02-4165115f003b","pid":"5e928938-a096-9918-d6de-26cdca9667a7","children":[{"id":"b0636c06-c974-9f12-7bfd-52378a69a7b5","pid":"80af7188-e069-4670-ff02-4165115f003b","children":[]},{"id":"e52c386e-2394-96d0-debb-6be731a19317","pid":"80af7188-e069-4670-ff02-4165115f003b","children":[]}]},{"id":"2a8d6370-c94d-bce6-9546-2e3141301011","pid":"5e928938-a096-9918-d6de-26cdca9667a7","children":[{"id":"9158b8b1-3a97-47b6-b64c-3aca7f5e6502","pid":"2a8d6370-c94d-bce6-9546-2e3141301011","children":[]},{"id":"f745f04e-f47f-201f-08eb-9700397c5616","pid":"2a8d6370-c94d-bce6-9546-2e3141301011","children":[]},{"id":"c85dce3d-47fa-d53b-3c6c-14606939b347","pid":"2a8d6370-c94d-bce6-9546-2e3141301011","children":[]}]}]},{"id":"bc3d7019-9cf5-8b16-f919-784095b4c6bb","pid":"d6c7c785-b847-bb88-f9e9-8492ff00c3f6","children":[{"id":"0c01eab0-c008-3c77-1fa2-fb3e6d4f99fc","pid":"bc3d7019-9cf5-8b16-f919-784095b4c6bb","children":[{"id":"dc25c661-4f22-a132-0802-c3b4156f1ea0","pid":"0c01eab0-c008-3c77-1fa2-fb3e6d4f99fc","children":[]},{"id":"009af8e4-8a8e-2733-25f5-5fc36878f82b","pid":"0c01eab0-c008-3c77-1fa2-fb3e6d4f99fc","children":[]}]}]},{"id":"126becbd-23bf-c661-1bb8-c00802c20f0d","pid":"d6c7c785-b847-bb88-f9e9-8492ff00c3f6","children":[{"id":"94a4e45c-344d-6bd9-1ace-68205b994101","pid":"126becbd-23bf-c661-1bb8-c00802c20f0d","children":[{"id":"f92b56d3-b06c-e521-29b1-22f4f614d352","pid":"94a4e45c-344d-6bd9-1ace-68205b994101","children":[]}]}]}]},{"id":"14ae52da-e05e-2cb7-f0e6-1d9d06a825ea","pid":"129e0375-c786-c4bc-e6dd-fb977595269b","children":[{"id":"44f7b5f9-1593-2470-e474-c61c144e8acb","pid":"14ae52da-e05e-2cb7-f0e6-1d9d06a825ea","children":[{"id":"b3c64926-7386-042b-a181-fa0ab0d13be8","pid":"44f7b5f9-1593-2470-e474-c61c144e8acb","children":[{"id":"93c9cef2-b0e6-0ad9-7c8c-08122f8cda4c","pid":"b3c64926-7386-042b-a181-fa0ab0d13be8","children":[]}]},{"id":"d80db4ca-c2c7-30cf-1dbe-049a7ca5fecd","pid":"44f7b5f9-1593-2470-e474-c61c144e8acb","children":[{"id":"9458c3a9-2b65-aad3-4b0c-f32db3f98426","pid":"d80db4ca-c2c7-30cf-1dbe-049a7ca5fecd","children":[]},{"id":"ce9476ec-bd05-230d-17a1-a4c7a6fd9ece","pid":"d80db4ca-c2c7-30cf-1dbe-049a7ca5fecd","children":[]}]},{"id":"7c9deec4-f702-6854-18b3-1dea428d5ac4","pid":"44f7b5f9-1593-2470-e474-c61c144e8acb","children":[{"id":"38e0e7a8-6e83-753a-9fca-b23983266d17","pid":"7c9deec4-f702-6854-18b3-1dea428d5ac4","children":[]},{"id":"db482cb2-8a96-294c-e070-25f304a71edc","pid":"7c9deec4-f702-6854-18b3-1dea428d5ac4","children":[]},{"id":"b6a8d642-afef-2e4c-cfda-44823d363e90","pid":"7c9deec4-f702-6854-18b3-1dea428d5ac4","children":[]}]}]}]},{"id":"b5a18a72-45d6-f6b0-5c28-47f0eba24a70","pid":"129e0375-c786-c4bc-e6dd-fb977595269b","children":[{"id":"9d04bfea-c971-e053-3c9d-c109b44f70c1","pid":"b5a18a72-45d6-f6b0-5c28-47f0eba24a70","children":[{"id":"0977b6fd-8380-8685-000f-54317d95ffee","pid":"9d04bfea-c971-e053-3c9d-c109b44f70c1","children":[{"id":"4eedab38-7e39-d256-afc7-060ccf8f4fde","pid":"0977b6fd-8380-8685-000f-54317d95ffee","children":[]}]},{"id":"0efdef22-0e0f-bf5c-09c7-1ac2f43c3631","pid":"9d04bfea-c971-e053-3c9d-c109b44f70c1","children":[{"id":"f886708f-947a-379c-7f82-6dc3cf70c80a","pid":"0efdef22-0e0f-bf5c-09c7-1ac2f43c3631","children":[]},{"id":"cba0bf66-086c-5a4a-be63-b1af1164846f","pid":"0efdef22-0e0f-bf5c-09c7-1ac2f43c3631","children":[]}]}]},{"id":"fbe8efd4-f190-ba6e-6908-38032b6c778a","pid":"b5a18a72-45d6-f6b0-5c28-47f0eba24a70","children":[{"id":"c7993bdb-a2a2-9e12-102a-f1fde05e5916","pid":"fbe8efd4-f190-ba6e-6908-38032b6c778a","children":[{"id":"6b9c1154-fad5-2289-5ad9-a4da05ee6f25","pid":"c7993bdb-a2a2-9e12-102a-f1fde05e5916","children":[]}]},{"id":"61acd529-3ec4-5fb3-f953-982111050050","pid":"fbe8efd4-f190-ba6e-6908-38032b6c778a","children":[{"id":"a1c505cd-3ac8-bf66-e009-97c6aa7d6eae","pid":"61acd529-3ec4-5fb3-f953-982111050050","children":[]}]}]}]}]},{"id":"61770df3-c940-0523-df60-44ce72563fc5","pid":"root","children":[{"id":"da8d2c5f-65ef-f4ee-ec99-5943a95b815e","pid":"61770df3-c940-0523-df60-44ce72563fc5","children":[{"id":"f428aea0-ceb3-2783-8745-6f29a340ba3e","pid":"da8d2c5f-65ef-f4ee-ec99-5943a95b815e","children":[{"id":"13af4182-e5bf-18a2-8371-2baf3af55603","pid":"f428aea0-ceb3-2783-8745-6f29a340ba3e","children":[{"id":"10aeb6aa-6110-69fe-b64e-d31bad0ff68b","pid":"13af4182-e5bf-18a2-8371-2baf3af55603","children":[]},{"id":"27eb91c9-074a-71b0-e5b8-326ac03723e5","pid":"13af4182-e5bf-18a2-8371-2baf3af55603","children":[]}]},{"id":"525d0a3f-71d6-7ef1-100e-1ab3c74de69e","pid":"f428aea0-ceb3-2783-8745-6f29a340ba3e","children":[{"id":"be5cc2d0-b5e3-1654-f48b-3be431939e66","pid":"525d0a3f-71d6-7ef1-100e-1ab3c74de69e","children":[]},{"id":"5c787da2-a22a-3af1-5988-b4f72b8dcde2","pid":"525d0a3f-71d6-7ef1-100e-1ab3c74de69e","children":[]}]},{"id":"bcc6aa6d-02ef-9514-0965-bbd688b4ec93","pid":"f428aea0-ceb3-2783-8745-6f29a340ba3e","children":[{"id":"0ec6aad8-a7f6-0dd8-55ad-7569b3ace8e8","pid":"bcc6aa6d-02ef-9514-0965-bbd688b4ec93","children":[]},{"id":"ca00caf0-ad42-2c97-f686-9f34037089d4","pid":"bcc6aa6d-02ef-9514-0965-bbd688b4ec93","children":[]}]}]}]},{"id":"0649c717-d277-f799-7aa7-0f501f8349e8","pid":"61770df3-c940-0523-df60-44ce72563fc5","children":[{"id":"2facdf69-d313-7d7d-7237-aad4a62c5a4d","pid":"0649c717-d277-f799-7aa7-0f501f8349e8","children":[{"id":"186f40bc-b20c-dc98-ef3c-873d6bd1f6e6","pid":"2facdf69-d313-7d7d-7237-aad4a62c5a4d","children":[{"id":"60ec4e1a-e8e0-72a6-bbd4-174bd4caad08","pid":"186f40bc-b20c-dc98-ef3c-873d6bd1f6e6","children":[]},{"id":"035cfa1b-422a-fda6-3858-0811d5279706","pid":"186f40bc-b20c-dc98-ef3c-873d6bd1f6e6","children":[]}]},{"id":"1eb4b850-0edf-aee3-3d28-74eb8b187cb1","pid":"2facdf69-d313-7d7d-7237-aad4a62c5a4d","children":[{"id":"9ffdecac-8dc7-2b64-546c-fd05596eab3a","pid":"1eb4b850-0edf-aee3-3d28-74eb8b187cb1","children":[]},{"id":"0fe9d607-0e16-ac03-0610-ec0619f65205","pid":"1eb4b850-0edf-aee3-3d28-74eb8b187cb1","children":[]}]},{"id":"7e224fc0-9aeb-f647-2d18-02c32d76f47b","pid":"2facdf69-d313-7d7d-7237-aad4a62c5a4d","children":[{"id":"5c11d266-1c51-6c5b-5360-55961f15b1d2","pid":"7e224fc0-9aeb-f647-2d18-02c32d76f47b","children":[]},{"id":"a73c3350-cff1-af9f-de39-3390b786c226","pid":"7e224fc0-9aeb-f647-2d18-02c32d76f47b","children":[]},{"id":"4d91d113-92d3-613e-336e-19cb2142ef33","pid":"7e224fc0-9aeb-f647-2d18-02c32d76f47b","children":[]}]}]},{"id":"d0987449-88d2-35fe-0d64-ddf23a6d9c2f","pid":"0649c717-d277-f799-7aa7-0f501f8349e8","children":[{"id":"0b05a3b8-13ca-b330-3ab4-5c2aa2488efa","pid":"d0987449-88d2-35fe-0d64-ddf23a6d9c2f","children":[{"id":"e436a386-5f67-e49f-d3d8-6c96f9e7dfcd","pid":"0b05a3b8-13ca-b330-3ab4-5c2aa2488efa","children":[]},{"id":"ed5a2380-35ae-a2d4-8d4b-83d110960797","pid":"0b05a3b8-13ca-b330-3ab4-5c2aa2488efa","children":[]},{"id":"c5d79994-743d-20ef-e3f8-3226c9f6ce31","pid":"0b05a3b8-13ca-b330-3ab4-5c2aa2488efa","children":[]}]}]}]},{"id":"efe03d5d-4e1f-43db-88c3-f9ceef2fef75","pid":"61770df3-c940-0523-df60-44ce72563fc5","children":[{"id":"78a9b68c-20b0-6596-20f3-fd6656d5405c","pid":"efe03d5d-4e1f-43db-88c3-f9ceef2fef75","children":[{"id":"b5c33b01-d50f-f422-2a49-88bbb7a57ea4","pid":"78a9b68c-20b0-6596-20f3-fd6656d5405c","children":[{"id":"77a7d70d-3849-ce9f-72f0-568cbf182839","pid":"b5c33b01-d50f-f422-2a49-88bbb7a57ea4","children":[]},{"id":"41e16878-efd6-5736-4855-1386a3f1fac2","pid":"b5c33b01-d50f-f422-2a49-88bbb7a57ea4","children":[]},{"id":"ff373ac1-114a-236c-64be-e7de8934a95a","pid":"b5c33b01-d50f-f422-2a49-88bbb7a57ea4","children":[]}]},{"id":"475b75b3-51b8-1f89-08b2-b23d76891a9b","pid":"78a9b68c-20b0-6596-20f3-fd6656d5405c","children":[{"id":"bd33e37b-835b-41e8-7588-52e8e2adf5aa","pid":"475b75b3-51b8-1f89-08b2-b23d76891a9b","children":[]}]},{"id":"7a9d44fc-29ac-9168-fc06-50d09515667d","pid":"78a9b68c-20b0-6596-20f3-fd6656d5405c","children":[{"id":"81c1e082-436f-94a8-fe75-06c7095a82fe","pid":"7a9d44fc-29ac-9168-fc06-50d09515667d","children":[]},{"id":"16d9fbbf-62bd-1ace-6596-1f4fe24211bc","pid":"7a9d44fc-29ac-9168-fc06-50d09515667d","children":[]}]}]},{"id":"1b521d04-2222-64f9-5add-d4e4ffb96f74","pid":"efe03d5d-4e1f-43db-88c3-f9ceef2fef75","children":[{"id":"2cb40cca-eb01-55f1-a8d7-b26d0560db20","pid":"1b521d04-2222-64f9-5add-d4e4ffb96f74","children":[{"id":"7a57bcd3-330f-b655-b771-0ba7ee6d958c","pid":"2cb40cca-eb01-55f1-a8d7-b26d0560db20","children":[]},{"id":"c0864678-3126-3d0c-8340-8c456dbd26b9","pid":"2cb40cca-eb01-55f1-a8d7-b26d0560db20","children":[]},{"id":"19b2253e-55a8-170a-98ac-93983f2976b0","pid":"2cb40cca-eb01-55f1-a8d7-b26d0560db20","children":[]}]},{"id":"da4cebe3-92e0-08a5-3279-b14286148b00","pid":"1b521d04-2222-64f9-5add-d4e4ffb96f74","children":[{"id":"49e32e1d-9897-bf12-8e5d-f183ff544e2a","pid":"da4cebe3-92e0-08a5-3279-b14286148b00","children":[]},{"id":"8b1b4806-1b0f-7dc4-0acf-a480d7832b80","pid":"da4cebe3-92e0-08a5-3279-b14286148b00","children":[]},{"id":"3797fd58-75d7-8e1a-2eb5-0d3479bab928","pid":"da4cebe3-92e0-08a5-3279-b14286148b00","children":[]}]},{"id":"621806b8-af12-55b1-bfe1-3325d9855ca7","pid":"1b521d04-2222-64f9-5add-d4e4ffb96f74","children":[{"id":"d6a2707b-f773-c6ef-ee8d-b5e469e7643e","pid":"621806b8-af12-55b1-bfe1-3325d9855ca7","children":[]},{"id":"4b05ebd8-59c2-1244-e0cb-7f02ec6f8278","pid":"621806b8-af12-55b1-bfe1-3325d9855ca7","children":[]}]}]}]}]}],"pid":-1}
    ];

    return defaults;
});
