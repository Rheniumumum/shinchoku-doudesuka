var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
    fetch: function(){
        var list = JSON.parse(
            localStorage.getItem(STORAGE_KEY)||'[]'
        )
        list.forEach(function(todo, index){
            todo.id = index
        })
        todoStorage.uid = list.length
        return list
    },
    save: function(list){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    }
}

const app = new Vue({
    el: '#app',
    data:{
        list:[],
        options:[
            { value: -1, label:'すべて' },
            { value: 0, label:'進捗だめです' },
            { value: 1, label:'進捗あります' },
            { value: 2, label:'タスク完了！'}
        ],
        current: -1,
        message: '',
    },
    methods:{
        doAdd: function(event,value){
            var task = this.$refs.task
            if (!task.value.length){
                return
            }
            var deadline = this.$refs.deadline
            var comment = this.$refs.comment
            if(isNaN(todoStorage.uid)){
                todoStorage.uid = 0
            }
            this.list.push({
                id: todoStorage.uid++,
                task: task.value,
                deadline: deadline.value,
                comment: comment.value,
                state: 0
            })
            task.value = ''
            deadline.value = ''
            comment.value = ''
        },
        doChangeState: function(item){
            if(item.state===0){
                item.state = 1
            } else if(item.state===1){
                item.state = 2
            } else {
                item.state = 0
            }
        },
        doRemove: function(item){
            var index = this.list.indexOf(item)
            this.list.splice(index,1)
        }
    },
    watch: {
        list: {
            handler: function(list){
                todoStorage.save(list)
            },
            deep: true
        }
    },
    created(){
        this.list = todoStorage.fetch()
    },
    computed:{
        computedList: function(){
            return this.list.filter(function(el){
                return this.current < 0 ? true : this.current === el.state
            }, this)
        },
        sortedItemsByDeadline(){
            return this.computedList.sort((a,b) => {
                return (a.deadline < b.deadline) ? -1: (a.deadline > b.deadline) ? 1:0;
            });;
        },
        labels(){
            return this.options.reduce(function(a,b){
                return Object.assign(a,{ [b.value]:b.label })
            },{})
        }
    },
})