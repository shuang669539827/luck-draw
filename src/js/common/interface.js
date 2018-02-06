// import Api from '../lib/Api'
import Api from 'api-mock-js'
// 1、获取计划

Api.define("getPlan", {
    input: {
        ct: 'tf-project',
        ac: 'getProjectPage',
        plan_id: 12234
    },


    mock: {
        code: 0,
        msg: "",
        data: {
            plan_id: 1311,
            plan_name: '',
            media: '',
            download_android: '',
            download_ios: '',
            
            list: [
                {
                    limit: false,           // 表示基础页面
                    template_id: 1,
                    // template_name: '模版名称',
                    content: {
                        title: '星辰奇缘',
                        components: [
                            {
                                type: 'fixed',
                                id: '1',
                                cid: '1001',
                                name: '顶部悬浮框',
                                disabled: false,
                                childs: [],
                                config: {
                                    click: true,
                                    css: {

                                    }
                                }
                            },
                            {
                                type: 'cut',
                                id: '1',
                                cid: '1001',
                                name: '顶部悬浮框',
                                disabled: false,
                                childs: [],
                                config: {
                                    click: true,
                                }
                            },
                            {
                                type: 'fixed',
                                id: '2',
                                cid: '1002',
                                name: '底部悬浮框',
                                disabled: false,
                                childs: []
                            },
                        ]
                    }
                },
                {
                    limit: [
                        {
                            time: '00:00-00:30',
                            week: '1', // 1~7表示星期一~星期日，0表示不限
                        },
                        {
                            time: '00:30-01:00',
                            week: '2', // 1~7表示星期一~星期日，0表示不限
                        },
                        {
                            time: '02:00-02:30',
                            week: '123', // 1~7表示星期一~星期日，0表示不限
                        }
                    ],
                    content: {
                        title: '星辰奇缘',
                        components: []
                    }
                },
                {
                    limit: [
                        {
                            time: '04:00-04:30',
                            week: '0', // 1~7表示星期一~星期日，0表示不限
                        }
                    ],
                    content: {
                        title: '星辰奇缘',
                        components: []
                    }
                },
                {
                    limit: [
                        {
                            time: '05:00-05:30',
                            week: '1234', // 1~7表示星期一~星期日，0表示不限
                        }
                    ],
                    content: {
                        title: '星辰奇缘',
                        components: []
                    }
                },
                {
                    limit: [
                        {
                            time: '06:00-06:30',
                            week: '7', // 1~7表示星期一~星期日，0表示不限
                        }
                    ],
                    content: {
                        title: '星辰奇缘',
                        components: []
                    }
                },
            ]
        }
    }
});




export default function () { }
