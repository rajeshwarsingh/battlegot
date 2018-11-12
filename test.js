let type = "sss"
let location=""
let king = "aaaa"
let m ='{$and : [{$or:[{attacker_king:\"'+ king+'\"},{defender_king:\"'+king+'\"}]}'+(location?',{location:\"'+location+'\"}':'')+(type?',{battle_type:\"'+type+'\"}':'')+']}'
console.log(m)



//db.getCollection("battle").aggregate([ 
//    {$project:{ id: "Null",attacker_king:"$attacker_king",defender_king:"$defender_king","region":"$region",name:"$name" }}, 
//    {$sort : {count : -1}}, 
// 
//])

db.getCollection("battle").aggregate([ 
    {$project:{most_active:{attacker_king:"$attacker_king",defender_king:"$defender_king",region:"$region",name:"$name"},attacker_outcome:{win:"win",loss:"loss"},"battle_type":["$battle_type"],defender_size:{average:{$avg:"$defender_size"},"min":"min",max:"max"} }}, 
    
 
])