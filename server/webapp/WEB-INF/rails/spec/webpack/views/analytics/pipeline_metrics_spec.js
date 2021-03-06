/*
 * Copyright 2018 ThoughtWorks, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {TestHelper} from "views/pages/artifact_stores/spec/test_helper";

describe("Pipeline Dashboard Metrics", () => {
  const m      = require('mithril');
  require('jasmine-jquery');
  const $ = require("jquery");

  const PipelineMetrics = require('views/analytics/pipeline_metrics');

  const supportedMetrics = () => ({
    "plugin-id-x": [{type: "pipeline", id: "metric-1"}],
    "plugin-id-y": [{type: "pipeline", id: "metric-1"}]
  });

  const pipelineList = () => ["p1", "p2", "p3"];
  const helper = new TestHelper();

  beforeEach(() => {
    jasmine.Ajax.install();
    mount(pipelineList(), supportedMetrics());
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
    helper.unmount();
  });

  it('should have a dropdown with each pipeline', () => {
    const list = helper.find("select option");
    expect(list.length).toBe(3);
    expect($(list[0]).val()).toBe("p1");
    expect($(list[1]).val()).toBe("p2");
    expect($(list[2]).val()).toBe("p3");
  });

  it('Add a frame for each plugin', () => {
    expect(helper.find("iframe").length).toBe(2);
  });

  it('should change displayed graphs when new pipeline is selected', () => {
    helper.find("select").val("p2").trigger("change");
    const requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(4);
    expect(requests.at(2).url).toBe('/go/analytics/plugin-id-x/pipeline/metric-1?pipeline_name=p2&context=dashboard');
    expect(requests.at(3).url).toBe('/go/analytics/plugin-id-y/pipeline/metric-1?pipeline_name=p2&context=dashboard');
  });

  const mount = (pipelines, metrics) => {
    helper.mount(() => m(PipelineMetrics, {
      pipelines,
      metrics
    }));
  };

});
