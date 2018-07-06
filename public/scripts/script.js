var app = angular.module('myapp', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'mainController'
         })
         .when('/reg', {
            templateUrl: 'views/reg.html',
            controller:'registrationController'
         })
        .when('/home', {
            templateUrl: 'views/home.html',
            controller:'homeController'
            
        })
        .when('/post',{
            templateUrl: 'views/post.html',
            controller:'postController'
        })
        .when('/search',{
            templateUrl:'views/search.html',
            controller:'searchController',
            // controller:'resultController'
        })
        .when('/applied',{
            templateUrl:'views/applied.html',
            controller:'appliedController'
        })
        // .when('/postajobpage', {
        //     templateUrl: 'views/postajobpage.html',
            
        // })
        // .when('/searchjob', {
        //     templateUrl: 'views/searchjobspage.html',
            
        .otherwise('/', {
             templateUrl: 'views/login.html'

        })
});

app.controller('mainController',function($scope,$location,$http,$rootScope){
    
    $scope.submit=function(){
        console.log($scope.authform);
        $http.post('http://localhost:8000/login1',$scope.authform).then(function(resp){
            console.log(resp);    
        console.log(resp.data.data);
            if(resp.data.flag!=="success")
            {
                $rootScope.wrong="Invalid Login Details Try again!!";
               
            }
            else{
                $location.path('/home');
            }
            if(resp.data.data.activeUser == true)
            {
                $rootScope.headerName = resp.data.data.username;
                sessionStorage.user = resp.data.data.username;
                console.log($rootScope.headerName);
                console.log(resp.data.data.usertype);

                $rootScope.btn1 = resp.data.data.usertype;
                $rootScope.btn2 = resp.data.data.usertype
                
            }
            
        })

    }
    
$scope.signup=function(){
$location.path('/reg');
}



});

app.controller('registrationController',function($scope,$http,$location){

    $scope.reg = function(){
        //console.log($scope.newUser);
    $http.post('http://localhost:8000/reg1',$scope.newUser).then(function(resp){
        // console.log(resp.data);
    })
      $location.path('/');
    }
})

app.controller('homeController',function($scope,$location,$http,$rootScope){
    $scope.postjob =function(){
        $location.path('/post');
    }
    $scope.searchjob=function(){
        $location.path('/search')
    }
    $scope.app_status=function(){
        $location.path('/applied')
    }
    $scope.logout=function(){
        
        $scope.userlogout=sessionStorage.user;
        delete sessionStorage.user;
        
        
        // $http.post('http://localhost:8000/logout1',$scope.headerName).then(function(resp){
    // console.log($scope.headerName);    
        console.log(resp);
        // delete sessionStorage.user;
        // })
        $location.path('/')
    }
})

app.controller('postController',function($scope,$http,$location){
    $scope.post = function(){
        console.log($scope.newPost);
       $http.post('http://localhost:8000/post1',$scope.newPost).then(function(resp){
        //console.log(resp);
    })
    $location.path('/home');
    }
})

app.controller('searchController',function($scope,$http,$location,$rootScope){
    $scope.search =function(){
        console.log($scope.userSearch);
        $http.post('http://localhost:8000/search1',$scope.userSearch).then(function(resp){
        console.log(resp.data.data);
       
        $rootScope.result = resp.data.data;
        //console.log(result);
    })
    }
    $scope.apply=function(event){
        url = "http://localhost:8000/applied1/" + sessionStorage.user;
        $scope.app_id=event.target.id;
        $scope.button=
        console.log(res._id);
       console.log($scope.app_id);
        // if(button id = $scope.app_id)
        // {
        // $scope.applied ="Applied";
        // }
        $http.post(url,{jobid:$scope.app_id}).then(function(resp){
            console.log(resp);
            
           
            
            //console.log(result);
        })
       
    }

    $scope.reset=function(){
        $scope.userSearch = null;
    }
  
  $scope.status_res=function(){
    $location.path('/home');
  }  

})


app.controller('appliedController',function($scope,$location,$http)
{
 
    $scope.app_result=function()
    {
        
        $http.post(`http://localhost:8000/getAppliedJobs/${sessionStorage.user}`,$scope.userSearch).then(res=>{
            console.log(res.data);
            $scope.jobs=res.data
        })
    }


});
