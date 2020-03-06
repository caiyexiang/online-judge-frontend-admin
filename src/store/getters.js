const getters = {
  sidebar: state => state.app.sidebar,
  username: state => state.user.username,
  userid: state => state.user.userid,
  name: state => state.user.name,
  nickname: state => state.user.nickname,
  permission: state => state.user.permission,
  permission_routes: state => state.permission.routes,
  problems: state => state.problem.problems,
  problems_score: state => state.problem.problems_score,
  load_flag: state => state.problem.load_flag,
  problems_length: state => {
    let len = 0
    for(let i=0;i<5;i++) {
      len += state.problem.problems[i].length
    }
    return len
  }
}
export default getters
