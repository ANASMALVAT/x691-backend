const axios = require('axios')
const dotenv = require('dotenv');
dotenv.config();

exports.ProjectControl = async (req, res, next) => {
    let {project_id, token, rootURL } = req.body;

    try{
        if(typeof project_id === 'undefined' || !typeof token === 'undefined' || typeof rootURL === 'undefined'){
            res.status(404).send("error");
        }
        if(!project_id  || !token || !rootURL){
            res.status(404).send("error");
        }
        if(rootURL === "" || project_id === "" || token === ""){
            res.status(404).send("error");
        }
        if(rootURL.length == 0){
            res.status(404).send("error");
        }
        if(rootURL[rootURL.length - 1] != '/'){
            rootURL+= "/api/v4";
        }
        else{
            rootURL += "api/v4";
        }
    }
    catch(error){
        res.status(404).json({message: "Error in code!"});
    }

    try{
            const request = {
                method: "GET",
                url: `${rootURL}/projects/${project_id}`,
                headers:{
                    "PRIVATE-TOKEN": token,
                }
            };

            console.log("Fetching project information.....");
            const project = await axios.request(request);
            let projectInfo = [];
            projectInfo.push({id : project.data.id});
            projectInfo.push({name : project.data.name});
            projectInfo.push({url : project.data.web_url});

            console.log("Project information fetched!");

            const requestMember = {
                method: "GET",
                url: `${rootURL}/projects/${project_id}/members`,
                headers:{
                    "PRIVATE_TOKEN": token,
                }
            };

            let ProjectMembersInformation = {};
            let ProjectMembersInformationUserName = {};
            const projectMembers = await axios.request(requestMember);

            for(let i = 0 ; i < projectMembers.data.length; i ++)
            {
                let memberInfo = projectMembers.data[i];
                ProjectMembersInformation[memberInfo.name] =
                {
                    user_info:{
                        "user_id" : memberInfo.id,
                        "user_name" : memberInfo.username,
                        "user_state" : memberInfo.state,
                        "user_membership_state" : memberInfo.membership_state,
                        "user_url" : memberInfo.web_url
                    },
                    user_commits:[],
                    user_merge_requests:[]
                }

                ProjectMembersInformationUserName[memberInfo.username] = {
                    user_info:{
                        "user_id" : memberInfo.id,
                        "name" : memberInfo.name,
                        "user_state" : memberInfo.state,
                        "user_membership_state" : memberInfo.membership_state,
                        "user_url" : memberInfo.web_url
                    },
                    user_commits:[],
                    user_merge_requests:[]
                }

            }

            console.log("Member's information Fetched!");
            
            const requestBranches = {
                method: "GET",
                url: `${rootURL}/projects/${project_id}/repository/branches`,
                headers:{
                    "PRIVATE_TOKEN": token,
                }
            };

            let branches = [];
            const projectBranchInformation = await axios.request(requestBranches);
           for(let i = 0; i < projectBranchInformation.data.length; i ++){
                branches.push(projectBranchInformation.data[i].name);
           }
          
           console.log("Fetching member's commits....!");

           for(let i = 0 ; i < branches.length; i ++)
           {
                let branch_name = branches[i];
                const requestBranchCommit = { 
                    method: "GET",
                    url: `${rootURL}/projects/${project_id}/repository/commits?ref_name=${branch_name}&with_stats=true&all=true`,
                    headers:{
                        "PRIVATE-TOKEN": token,
                        }
                    };
                const projectBranchCommitInformation = await axios.request(requestBranchCommit);

                
                for(let j = 0 ; j < projectBranchCommitInformation.data.length ; j ++)
                {
                    let projectCommit = projectBranchCommitInformation.data[j];
                   
                    let projectCommiterName = projectCommit.committer_name;
                    if(ProjectMembersInformation[projectCommiterName] || ProjectMembersInformationUserName[projectCommiterName])
                        {
                            let  finalProjectCommiterName = "";
                            if(!ProjectMembersInformation[projectCommiterName]){
                                finalProjectCommiterName = ProjectMembersInformationUserName[projectCommiterName]?.user_info.name;
                            }
                            else{
                                finalProjectCommiterName = projectCommiterName;
                            }
                            let existingCommit = ProjectMembersInformation[finalProjectCommiterName].user_commits;

                            const isExisting = existingCommit.some(com => com.commit_id === projectCommit.id);

                            if(!isExisting){
                                ProjectMembersInformation[finalProjectCommiterName].user_commits.push({
                                    commit_id: projectCommit.id,
                                    commit_stats: projectCommit.stats,
                                    committed_date: projectCommit.created_at,
                                    commit_message: projectCommit.message,
                                    commit_url : projectCommit.web_url,
                                    commit_branch:branch_name
                                })
                            }
                        }
                }
            }

           console.log("Member's commits Fetched!");

           console.log("Fetching member's Merge Requests!");

           for(let i = 0 ; i < branches.length; i ++)
           {
                let branch_name = branches[i];

                for (const userObject in ProjectMembersInformation)
                {
                    const user_name = ProjectMembersInformation[userObject].user_info.user_name;

                    let url = `${rootURL}/projects/${project_id}/merge_requests?source_branch=${branch_name}&state=all&order=topo&all=true&author_username=${user_name}&all=true`;

                    const requestBranchMergeRequest =  {method: "GET", url: url, headers:{ "PRIVATE-TOKEN": token, }};

                    const projectBranchMergeRequestInformation = await axios.request(requestBranchMergeRequest);
                   

                    for(let i = 0 ; i < projectBranchMergeRequestInformation.data.length; i ++){

                        let projectBranchMergeSingleRequest = projectBranchMergeRequestInformation.data[0];

                        let merge_id = projectBranchMergeSingleRequest.id;

                        let existingMergeRequest = ProjectMembersInformation[userObject].user_merge_requests;

                        const isExisting = existingMergeRequest.some(com => com.merge_id === merge_id);
                        if(!isExisting){
                            ProjectMembersInformation[userObject].user_merge_requests.push
                            ({
                                merge_id: projectBranchMergeSingleRequest.id,
                                description : projectBranchMergeSingleRequest.description,
                                created_at : projectBranchMergeSingleRequest.created_at,
                                state: projectBranchMergeSingleRequest.state,
                                merged_by : projectBranchMergeSingleRequest.merged_by,
                                target_branch: projectBranchMergeSingleRequest.target_branch,
                                source_branch: projectBranchMergeSingleRequest.source_branch,
                                author: projectBranchMergeSingleRequest.author,
                                web_url: projectBranchMergeSingleRequest.web_url,
                            })
                        }
                    }
                }
            }
           console.log("Member's Merge Request Fetched!");
           req.userdata = ProjectMembersInformation;
           next();

    }
    catch (error){
        res.status(404).json({message: "Error in code!"});
    }
  };












// commit

// {
//     id: '1620465b989d3845725138afd9dc386b6482a25c',
//     short_id: '1620465b',
//     created_at: '2023-10-10T12:44:10.000-03:00',
//     parent_ids: [
//       'cc7e9c99313ec8e90dc6fe75486a1c7b56d07e0e',
//       '06939d169fa57731fdde02e088a7c4a653f0f9f3'
//     ],
//     title: "Merge branch 'backend-login-functionality' into 'develop'",
//     message: "Merge branch 'backend-login-functionality' into 'develop'\n" +
//       '\n' +
//       'Backend login functionality\n' +
//       '\n' +
//       'See merge request courses/csci-x691/fcs-peer-review-tool!3',
//     author_name: 'Theodore Bourgeois',
//     author_email: 'th291598@dal.ca',
//     authored_date: '2023-10-10T12:44:10.000-03:00',
//     committer_name: 'Theodore Bourgeois',
//     committer_email: 'th291598@dal.ca',
//     committed_date: '2023-10-10T12:44:10.000-03:00',
//     trailers: {},
//     web_url: 'https://git.cs.dal.ca/courses/csci-x691/fcs-peer-review-tool/-/commit/1620465b989d3845725138afd9dc386b6482a25c',
//     stats: { additions: 18549, deletions: 628, total: 19177 }
//   }


  //merge_request:

//   [
//     {
//       id: 33458,
//       iid: 19,
//       project_id: 67291,
//       title: "added button functions for GameOver. Instead of respawning after a certain time you can click a respawn button. The other buttons don't work yet because not everything is in develop.",
//       description: 'this should just add the respawn buttons into develop.\n' +
//         'I added new objects and made very small changes to the health script.',
//       state: 'merged',
//       created_at: '2023-03-15T12:58:34.150-03:00',
//       updated_at: '2023-03-15T19:23:37.012-03:00',
//       merged_by: {
//         id: 1831,
//         username: 'sabiha',
//         name: 'Sabiha Khan',
//         state: 'active',
//         avatar_url: null,
//         web_url: 'https://git.cs.dal.ca/sabiha'
//       },
//       merge_user: {
//         id: 1831,
//         username: 'sabiha',
//         name: 'Sabiha Khan',
//         state: 'active',
//         avatar_url: null,
//         web_url: 'https://git.cs.dal.ca/sabiha'
//       },
//       merged_at: '2023-03-15T19:23:35.538-03:00',
//       closed_by: null,
//       closed_at: null,
//       target_branch: 'develop',
//       source_branch: 'MK85_GameOverFunction',
//       user_notes_count: 0,
//       upvotes: 0,
//       downvotes: 0,
//       author: {
//         id: 3715,
//         username: 'bfrank',
//         name: 'Braden Frank',
//         state: 'active',
//         avatar_url: null,
//         web_url: 'https://git.cs.dal.ca/bfrank'
//       },
//       assignees: [],
//       assignee: null,
//       reviewers: [],
//       source_project_id: 67291,
//       target_project_id: 67291,
//       labels: [],
//       draft: false,
//       work_in_progress: false,
//       milestone: null,
//       merge_when_pipeline_succeeds: false,
//       merge_status: 'can_be_merged',
//       detailed_merge_status: 'not_open',
//       sha: '3ef33dc68e9e7791f5d8b2afcd0be518fcb394f4',
//       merge_commit_sha: 'fcb965e416aeeb2044794badf5e2700fd5518e0d',
//       squash_commit_sha: null,
//       discussion_locked: null,
//       should_remove_source_branch: false,
//       force_remove_source_branch: true,
//       prepared_at: '2023-03-15T12:58:34.150-03:00',
//       reference: '!19',
//       references: {
//         short: '!19',
//         relative: '!19',
//         full: 'courses/csci-x691/mi_kmaw-kina_matnewey!19'
//       },
//       web_url: 'https://git.cs.dal.ca/courses/csci-x691/mi_kmaw-kina_matnewey/-/merge_requests/19',      
//       time_stats: {
//         time_estimate: 0,
//         total_time_spent: 0,
//         human_time_estimate: null,
//         human_total_time_spent: null
//       },
//       squash: false,
//       squash_on_merge: false,
//       task_completion_status: { count: 0, completed_count: 0 },
//       has_conflicts: false,
//       blocking_discussions_resolved: true,
//       approvals_before_merge: null
//     }
//   ]