<template>
    <div class="analysis-report">
        <Card>
            <p slot="title">研究院出品</p>
            <div class="main-body">
                <div class="list">
                    <div class="groups">
                        <Input type="text" class="w-260" placeholder="请输入搜索词"/>
                        <Button type="primary">搜索</Button>
                    </div>
                    <div class="list-table">
                        <div class="image">
                            <img src="" alt="">
                        </div>
                         <div class="content">
                             <h4>中国铁路&大数据：2018年春运大数据</h4>
                             <p class="text">本报告旨在带领读者一同浏览国外的自适应学习概况，探讨自适应到底是什么、人工智能自适应教育又是什么，呈现目前的</p>
                             <div class="keyword groups">
                                 <span>春运</span>
                                 <span>大数据</span>
                             </div>
                             <div>
                                 <span class="time">2018年02月21日</span>
                                 <span class="count">阅读(5427)</span>
                             </div>
                         </div>
                    </div>
                </div>
                <div class="tag">
                    <Card>
                        <p slot="title">标签</p>
                        <div>
                            <Button >123</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </Card>
    </div>
</template>
<script>
    import "@/assets/css/analysisReport.less";
    export default {
        data(){
           return {

           }
          }
    }
</script>