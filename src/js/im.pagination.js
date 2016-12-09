/**
 * name: tm.pagination
 * Version: 1.0.0 beta
 */
angular.module('im.pagination', []).directive('imPagination',[function(){
    return {
        restrict: 'EA',
        template:'<div class="page-list">'
                    +'<ul class="pagination" ng-show="conf.totalCount > 0">'
                    +'<li ng-class="{disabled: params.page == 1}" ng-click="prevPage()" class="disabled"><span>«</span></li>'
                    +'<li ng-repeat="item in pages track by $index" ng-class="{active: item == params.page}" ng-click="showPage(item)"><span>{{item}}</span></li>'
                    +'<li ng-class="{disabled: params.page == conf.pageCount}" ng-click="nextPage()"><span>»</span></li>'
                    +'</ul>'
                    +'<div class="page-total" ng-show="conf.totalCount > 0">每页'
                    +'<select ng-model="params.rows" ng-options="option for option in conf.pageOptions " ng-change="changeRows()" class="">条'
                    +'</select>/共<strong class="ng-binding">{{conf.totalCount}}</strong>条 跳转至'
                    +'<input type="text" ng-model="jumpPageNum" ng-keyup="jumpPageKeyUp($event)" class="ng-pristine ng-untouched ng-valid ng-empty">'
                    +'</div>'
                    +'<div class="no-items ng-hide" style="text-align: center;" ng-show="conf.totalCount <= 0">暂无数据!</div>'
                    +'</div>',
        //templateUrl:'templ/page.html',
        replace: true,
        scope: {
            conf: '=',
            params:'=',
            getData:'&'
        },
        link: function(scope, element, attrs) {

            var showPages=  scope.conf.showPages=   scope.conf.showPages || 9;

            if(scope.conf.showPages % 2 === 0) {
                showPages=  scope.conf.showPages += 1;
            }
            scope.getData();    



            //初始化页码
            function initPages(){
                scope.conf.pageOptions=scope.conf.pageOptions||[2,5,10];

                // 判断当前 rows 是否在pageOptions中, 如果没有就push 进去后再从小到大排序
                var len=scope.conf.pageOptions.length;
                var rowsState;

                for (var i = 0; i <len; i++) {
                    if(scope.conf.pageOptions[i]==scope.params.rows){
                        rowsState=true;
                    }
                }

                if(!rowsState){
                    scope.conf.pageOptions.push(scope.params.rows);
                }
                    
                scope.conf.pageOptions.sort(function(a,b){
                    return a-b;
                });

                var arr=[];

                if(scope.conf.pageCount <= showPages){
                    // 判断总页数如果小于等于分页的长度，若小于则直接显示
                    for (var i = 1; i <=scope.conf.pageCount; i++) {
                        arr.push(i);
                    }

                }else{
                    // 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
                    // 计算中心偏移量

                    var offset= Math.ceil(showPages/2);

                    // 1,2,3,4,5，...,maxPage
                    if(scope.params.page<=offset){

                        for (var i = 1; i <= offset+1; i++) {
                            arr.push(i);
                        }

                        arr.push('...');

                        arr.push(scope.conf.pageCount);

                    // 右边没有 ex:1,...,max-2,max-1,max    
                    }

                    else if(scope.params.page > scope.conf.pageCount- offset){
                        arr.push(1);
                        arr.push('...')
                        for(var i=offset+1; i>=1; i--){
                            arr.push(scope.conf.pageCount-i);
                        }
                        arr.push(scope.conf.pageCount);

                    //两边都有：    1,...,4,5,6,7,...,max
                    }else{

                        arr.push(1);
                        arr.push('...')

                        for(i = Math.ceil(offset/2); i>=1; i--){
                            arr.push(scope.params.page-i);
                        }

                        arr.push(scope.params.page);
                        
                        for(var j=1; j<Math.ceil(offset/2); j++){
                            arr.push(scope.params.page+j);
                        }

                        arr.push('...');
                        arr.push(scope.conf.pageCount);

                    }
                }

                scope.pages=arr;

            }

            initPages();

            //上一页
            scope.prevPage=function(){
                if (scope.params.page<=1) {
                    scope.params.page=1;
                }else{
                    scope.params.page--;
                    scope.getData();
                }
            };


            //下一页
            scope.nextPage=function(){
                if(scope.params.page>=scope.conf.pageCount){
                    scope.params.page=scope.conf.pageCount;
                }else{
                    scope.params.page++;
                    scope.getData();
                }

            };

            //显示某一页
            scope.showPage=function(page){
                if(page=='...'){
                    return;
                }

                scope.params.page=page;
                scope.getData();
            };


            scope.changeRows=function(){
                //scope.params.rows=rows;
                scope.getData();

            };

            //跳转到某页
            scope.jumpPageKeyUp = function(e) {

                var keycode = window.event ? e.keyCode :e.which;
                
                if(scope.jumpPageNum>0 && scope.jumpPageNum<=scope.conf.pageCount){

                    if(keycode == 13) {
                        scope.showPage(scope.jumpPageNum);
                        scope.jumpPageNum='';
                    }
                }
            };


            scope.$watch('conf.pageCount+params.page', function(value, oldValue) {
                initPages();
            });
        }    
    };
}]);
