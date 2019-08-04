let data = [{
  id: 1,
  label: '一级 1',
  depth: 1,
  children: [{
    id: 4,
    label: '二级 1-1',
    depth: 2,
    parent: 1,
    children: [{
      id: 9,
      label: '三级 1-1-1',
      depth: 3,
      parent: 4
    }, {
      id: 10,
      label: '三级 1-1-2',
      depth: 3,
      parent: 4
    }]
  }]
}, {
  id: 2,
  label: '一级 2',
  depth: 1,
  children: [{
    id: 5,
    label: '二级 2-1',
    depth: 2,
    parent: 2
  }, {
    id: 6,
    label: '二级 2-2',
    depth: 2,
    parent: 2
  }]
}, {
  id: 3,
  label: '一级 3',
  depth: 1,
  children: [{
    id: 7,
    label: '二级 3-1',
    depth: 2,
    parent: 3
  }, {
    id: 8,
    label: '二级 3-2',
    depth: 2,
    parent: 3
  }]
}]
let selectedNodes = [ {
  id: 1,
  label: '一级 1',
  depth: 1,
  children: [{
    id: 4,
    label: '二级 1-1',
    depth: 2,
    parent: 1,
    children: [{
      id: 9,
      label: '三级 1-1-1',
      depth: 3,
      parent: 4
    }, {
      id: 10,
      label: '三级 1-1-2',
      depth: 3,
      parent: 4
    }]
  }]
}, {
  id: 4,
  label: '二级 1-1',
  depth: 2,
  parent: 1,
  children: [{
    id: 9,
    label: '三级 1-1-1',
    depth: 3,
    parent: 4
  }, {
    id: 10,
    label: '三级 1-1-2',
    depth: 3,
    parent: 4
  }
]}, {
  id: 10,
  label: '三级 1-1-2',
  depth: 3,
  parent: 4
}]
let findPath = function (nodes) {
  let pathMap = new Map ()
  if (nodes.length === 0) return
  // 先把头结点的id作为key
  nodes.forEach((item) => {
    if (item.depth === 1) {
      pathMap.set(item.id, [])
    } else if (item.parent) {
      pathMap = findRootParent(item, pathMap)
    }
  })
  console.log(pathMap)
}
let findRootParent = function (node, pathMap) {
  if (pathMap.has(node.parent)) {
    let arr = pathMap.get(node.parent)
    arr.push(node.id)
    pathMap.set(node.parent, arr)
    return pathMap
  } else {
    let parent_id = node.parent
    let cur = {}
    while (parent_id) {
      cur = findNodeById(data, parent_id)
      parent_id = cur.parent
    }
    if (pathMap.has(cur.id)) {
      let arr = pathMap.get(cur.id)
      arr.push(node.id)
      pathMap.set(cur.id,arr)
    }
    return pathMap
  }
}
// 根据id找节点
let findNodeById = function (collection, id) {
  for (let i = 0;  i < collection.length; i++) {
    let item = collection[i]
    if (item.id === id) {
      return item
    } else {
      let collect_item = item
      while (collect_item.hasOwnProperty('children')){
        let res = findNodeById(collect_item.children, id)
        if (res) {
          return res
        }
        collect_item = collect_item.children
      }
    }
  }
  return {}
}
findPath(selectedNodes)
// console.log(findNodeById(data, 1))
