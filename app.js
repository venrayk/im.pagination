/**
*  Mappodule
*
* Description
*/
var app=angular.module('app', ['im.pagination'])

.controller('mainCtrl',function($scope,$rootScope,$interval,$http){
	
	$scope.pageInfo={
		totalCount: 0,//总的记录条数
		pageCount: 0,// 总的页数
		pageOptions:[2,20,50,100],//每页条数的选项,选填
		showPages:5//显示几个页码,选填
	}

	$scope.params={
		rows:1,//每页显示条数
		page:1// 当前页
	}

	$scope.getData2=function(){

		$http.get('http://127.0.0.1:8080/guanxing_medical/base/drugInform/find',{params:$scope.params}).success(function(data){

			//----------------------------------------------------
			$scope.pageInfo.totalCount=data.message.totalCount;
			$scope.pageInfo.pageCount=data.message.pageCount;
			$scope.params.page=data.message.pageNumber;

			$scope.list=data.message.list;
		});
	};
})