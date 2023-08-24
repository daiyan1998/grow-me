import { useState, useEffect } from "react";
import { TreeView, TreeItem } from "@mui/x-tree-view";
import { Add, Remove } from "@mui/icons-material";
import { Checkbox, Typography } from "@mui/material";

interface Node {
  id: string;
  name: string;
  children: Node[];
  parent?: string | undefined;
}

const data: Node[] = [
  {
    id: "customer_service",
    name: "Customer Service",
    children: [
      { id: "support", name: "Support", children: [] },
      { id: "customer_success", name: "Customer Success", children: [] },
    ],
  },
  {
    id: "design",
    name: "Design",
    children: [
      { id: "graphic_design", name: "Graphic Design", children: [] },
      { id: "product_design", name: "Product Design", children: [] },
      { id: "web_design", name: "Web Design", children: [] },
    ],
  },
];

//BFS algorithm to find node by his ID
const bfsSearch = (graph: Node[], targetId: string): Node | undefined => {
  const queue = [...graph];

  while (queue.length > 0) {
    const currNode = queue.shift();
    if (currNode?.id === targetId) {
      return currNode;
    }
    if (currNode?.children) {
      queue.push(...currNode.children);
    }
  }
  return undefined; // Target node not found
};

export default function App() {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  useEffect(() => {
    console.log("Selected Nodes:");
    console.log(JSON.stringify(selectedNodes, null, 4));
  }, [selectedNodes]);

  // Retrieve all ids from node to his children's
  function getAllIds(node: Node, idList: string[] = []): string[] {
    idList.push(node.id);
    if (node.children) {
      node.children.forEach((child) => getAllIds(child, idList));
    }
    return idList;
  }
  // Get IDs of all children from specific node
  const getAllChild = (id: string): string[] => {
    const node = bfsSearch(data, id);
    if (node) {
      return getAllIds(node);
    }
    return [];
  };

  // Get all father IDs from specific node
  const getAllFathers = (id: string, list: string[] = []): string[] => {
    const node = bfsSearch(data, id);
    if (node?.parent) {
      list.push(node.parent);

      return getAllFathers(node.parent, list);
    }

    return list;
  };

  function isAllChildrenChecked(node: Node, list: string[]): boolean {
    const allChild = getAllChild(node.id);
    const nodeIdIndex = allChild.indexOf(node.id);
    allChild.splice(nodeIdIndex, 1);

    return allChild.every((nodeId) =>
      selectedNodes.concat(list).includes(nodeId)
    );
  }

  const handleNodeSelect = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    nodeId: string
  ) => {
    event.stopPropagation();
    const allChild = getAllChild(nodeId);
    const fathers = getAllFathers(nodeId);

    if (selectedNodes.includes(nodeId)) {
      // Need to de-check
      setSelectedNodes((prevSelectedNodes) =>
        prevSelectedNodes.filter((id) => !allChild.concat(fathers).includes(id))
      );
    } else {
      // Need to check
      const ToBeChecked: string[] = [];
      for (let i = 0; i < fathers.length; ++i) {
        const fatherNode = bfsSearch(data, fathers[i]);
        if (fatherNode && isAllChildrenChecked(fatherNode, allChild)) {
          ToBeChecked.push(fathers[i]);
        }
      }
      setSelectedNodes((prevSelectedNodes) => [
        ...prevSelectedNodes,
        ...ToBeChecked,
        ...allChild,
      ]);
    }
  };

  const handleExpandClick = (event: React.MouseEvent) => {
    // prevent the click event from propagating to the checkbox
    event.stopPropagation();
  };

  const renderTree = (nodes: Node) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      onClick={handleExpandClick}
      label={
        <>
          <Checkbox
            checked={selectedNodes.indexOf(nodes.id) !== -1}
            tabIndex={-1}
            disableRipple
            onClick={(event) => handleNodeSelect(event, nodes.id)}
          />
          {nodes.name}
        </>
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node: Node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <>
      <Typography variant="h3" sx={{ textAlign: "center", m: "20px 0" }}>
        Tree View
      </Typography>
      <TreeView
        multiSelect
        defaultCollapseIcon={<Remove />}
        defaultExpandIcon={<Add />}
        selected={selectedNodes}
      >
        {data.map((node) => renderTree(node))}
      </TreeView>
    </>
  );
}
