import * as core from "@actions/core";
import * as github from "@actions/github";
import {validateSubscription} from "./subscription";

type DeploymentState =
  | "error"
  | "failure"
  | "inactive"
  | "in_progress"
  | "queued"
  | "pending"
  | "success";

async function run() {
  try {
    await validateSubscription();

    const context = github.context;

    const prStringInput = core.getInput("pr", {
      required: false
    });
    const pr: boolean = prStringInput === "true";

    const pr_id = core.getInput("pr_id", {required: false}) || 0;

    const defaultUrl = pr ? `https://github.com/${context.repo.owner}/${context.repo.repo}/pull/${pr_id}/checks` : `https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}/checks`;

    const token = core.getInput("token", { required: true });
    const url = core.getInput("target_url", { required: false }) || defaultUrl;
    const description = core.getInput("description", { required: false }) || "";
    const deploymentId = core.getInput("deployment_id");
    const environmentUrl = core.getInput("environment_url", { required: false }) || "";
    const state = core.getInput("state") as DeploymentState;

    const client = github.getOctokit(token);

    await client.rest.repos.createDeploymentStatus({
      ...context.repo,
      deployment_id: (() => {
        const id = parseInt(deploymentId, 10);
        if (isNaN(id)) throw new Error(`deployment_id must be a valid integer, got: "${deploymentId}"`);
        return id;
      })(),
      state,
      log_url: defaultUrl,
      target_url: url,
      description,
      environment_url: environmentUrl,
    });
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    } else {
      core.setFailed(String(error));
    }
  }
}

run();
