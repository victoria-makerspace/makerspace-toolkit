import { authHeader } from '../helpers';

export const toolService = {
  getTools,
  getTool,
  addTool,
  deleteTool,
  updateTool,
  updateToolState,
};

function getTools() {
  this.$http.get("tools", { headers: authHeader() }).then(response => {
    return response.data;
  });
}

function getTool(id) {
  this.$http.get("tools/" + id).then(response => {
    return response.data;
  });
}

function updateTool(tool) {
  this.$http
  .put("tools/" + tool.id, tool)
  .then(() => {
    return tool;
  });
}

function addTool(tool) {
  this.$http.post("tools/", tool).then(response => {
    return response.data;
  });
}

function deleteTool(id) {
  this.$http.delete("tools/" + id);
}

function updateToolState(id, state) {
  this.$http.post('tools/' + id + '/states', state)
    .then(response => {
      return response.data;
    }
  );
}