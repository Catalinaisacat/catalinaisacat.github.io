---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>
# 👋 About Me
Hi, I am Shucheng! 

I'm a rising senior from NYU Shanghai, majoring in Neuroscience (honors track) and minoring in Maths. I’m privileged to work on computational cognitive neuroscience under the mentoring of <strong style="color: #4b6aa1;"><a href="https://as.nyu.edu/faculty/weiji-ma.html" style="color: #4b6aa1; text-decoration: none;">Prof. Wei Ji Ma</a></strong>, <strong style="color: #4b6aa1;"><a href="https://shanghai.nyu.edu/academics/faculty/directory/zhong-lin-lu" style="color: #4b6aa1; text-decoration: none;">Prof. Zhong-Lin Lu</a></strong>, and <strong style="color: #4b6aa1;"><a href="https://shanghai.nyu.edu/academics/faculty/directory/xing-tian" style="color: #4b6aa1; text-decoration: none;">Prof. Xing Tian</a></strong>.

I'm interested in **how the human brain proceeds and reacts upon information**. As an information machine, the human brain is a marvel of efficiency and complexity, continuously handling a dynamic influx of sensory input. This leads me to wonder if there are some simple but highly adaptive computations shared by different cognitive processes. Or, if there are some representations shared across different forms of contexts. I am devoted to finding these keys to unlock the black box.

I mainly use a combination of three tools: **computational models, behavioral/psychophysical experiments, and neural recordings**. Computational models illuminate the pathway that could be wrong or irrelevant. Experiments provide the observable truth that could be chaotic or too complex. Neural recordings capture the direct imprint of cognitive processes that could be blurry and intricate. Having quite a lot of trial and error solely relying on any one of these tools, I realized that the integrated method is essential in evaluating models, improving experiment designs, and building a more holistic and accurate interpretation of data.

I love interdisciplinary work and collaboration with people from different backgrounds, as innovations often come from unexpected connections and fresh ways of thinking. I particularly like borrowing cool ideas/tools from physics, mathematics and computer science although I don’t have enough credits to take many related courses in my undergraduate. But I do enjoy learning them myself for research or in my free time for fun.

I'm seeking a Ph.D. position in Cognitive Science after my graduation in Fall 2025.

<span class='anchor' id='-research'></span>
# 📝 Research 
## Research Experience:
<table style="border-collapse: collapse; width: 100%; border: none; margin-top: 20px;">
  <tr style="border: none;">
    <td style="padding: 0 20px 3px 0; vertical-align: top; border: none;">2024.4-Present</td>
    <td style="padding: 0; vertical-align: top; border: none;">
      <strong style="color: #4b6aa1;"><a href="https://lobes.osu.edu/staff.php" style="color: #4b6aa1; text-decoration: none;">Laboratory Of Brain ProcessES (PI: Zhong-Lin Lu)</a></strong>, NYU Shanghai and NYU<br>
      <ul style="margin: 3px 0; padding-left: 20px; list-style: none;">
        <li style="margin: 0;">Computational Modelling; Eye-tracking; Visual Search; Attention</li>
      </ul>
    </td>
  </tr>
  <tr style="border: none;">
    <td style="padding: 0 20px 3px 0; vertical-align: top; border: none;">2023.9-Present</td>
    <td style="padding: 0; vertical-align: top; border: none;">
      <strong style="color: #4b6aa1;"><a href="https://www.cns.nyu.edu/malab/" style="color: #4b6aa1; text-decoration: none;">Wei Ji Ma Lab</a></strong>, NYU<br>
      <ul style="margin: 3px 0; padding-left: 20px; list-style: none;">
        <li style="margin: 0;">Planning; Think-aloud Protocol</li>
      </ul>
    </td>
  </tr>
  <tr style="border: none;">
    <td style="padding: 0 20px 3px 0; vertical-align: top; border: none;">2022.9-Present</td>
    <td style="padding: 0; vertical-align: top; border: none;">
      <strong style="color: #4b6aa1;"><a href="https://slangscience.github.io/slang/" style="color: #4b6aa1; text-decoration: none;">Speech, Language And Neuroscience Group (PI: Xing Tian)</a></strong>, NYU Shanghai<br>
      <ul style="margin: 3px 0; padding-left: 20px; list-style: none;">
        <li style="margin: 0;">Attention; Psycholinguistics; EEG; Eye-tracking</li>
      </ul>
    </td>
  </tr>
  <tr style="border: none;">
    <td style="padding: 0 20px 0 0; vertical-align: top; border: none;">2021.12-2022.3</td>
    <td style="padding: 0; vertical-align: top; border: none;">
      <strong style="color: #4b6aa1;"><a href="https://www.sainsburywellcome.org/web/groups/erlich-lab" style="color: #4b6aa1; text-decoration: none;">Erlich Lab (PI: Jeffery Erlich)</a></strong> (moved to UCL), NYU Shanghai<br>
      <ul style="margin: 3px 0; padding-left: 20px; list-style: none;">
        <li style="margin: 0;">Optogenetics; Single-neuron recording; Decision-Making under Risk</li>
      </ul>
    </td>
  </tr>
</table>
  
## Projects:
### Attention
**Does information entropy drive attention? How? (Supervisor: Zhong-Lin Lu)**

In our daily lives, we tend to pay attention to things that provide a lot of information (like short videos) rather than things that offer little information (like a blank piece of paper on your desk). This natural process helps our brains process information more efficiently, allowing us to prioritize new information and get a better understanding of our surroundings. We are proposing a new model for bottom-up visual attention based on Bayesian adaptive estimation and mutual information.

<hr style="border: 0.5px solid #f0f0f0; margin: 15px 0;">
**What is the representation of attention? (Supervisor: Xing Tian)**

It is a long way to go from “seeing” information as massive amounts of basic visual features to “understanding” them as knowledge, at which stage do we select them? This question (representation of attention) has been under debate for decades. Some believe that selection is solely based on basic visual features, while others believe that selection can also happen after grouping. In this study, we designed a novel visual search paradigm with eye-tracking and seeked to offer strong evidence for the later hypothesis.

<hr style="border: 0.5px solid #f0f0f0; margin: 15px 0;">
### Planning
**How do humans plan? (Supervisor: Wei Ji Ma)**

Planning is a complex cognitive process that requires mental stimulation for future scenarios. A traditional psychological method to investigate planning is called the “think-aloud” method. In this study, we revived this method in a game called 4-in-a-row. We recorded the free narration when participants were solving puzzles that required planning. We coded the narrations into a set of qualitative and quantitative metrics that offer a comprehensive understanding of human planning and inspired us to build new models.

<em style="color: #4b6aa1;"><a href="/images/thinkaloud_poster.pdf" style="color: #4b6aa1; text-decoration: none;" target="_blank">Click here for viewing the poster</a></em>

<hr style="border: 0.5px solid #f0f0f0; margin: 15px 0;">
### Decision Making
**How do people learn to make decisions from reward history?**

This is a final project from one of my favorite course “Decision Making” at NYU taught by <strong style="color: #4b6aa1;"><a href="https://as.nyu.edu/faculty/laurence-thomas-maloney.html" style="color: #4b6aa1; text-decoration: none;">Prof. Laurence Maloney</a></strong>.

Humans can learn from the past and adjust their perception of value and probability dynamically. For example, some people become more and more addicted to simple gambling games as they play them. To investigate this question, Prof. Maloney and I designed a series of experiments to play a lottery game for multiple rounds. They could make choices among “purchase,” “skip,” and "exit,” with an immediate outcome (whether winning the lottery or not) given after each trial. Our pilot data showed that the choices of participants are biased by a succession of wins or losses. We developed process models based on prospect theory, machine learning, and weighted Markov decision process.


<span class='anchor' id='-educations'></span>
# 📖 Educations
<table style="border-collapse: collapse; width: 100%; border: none; margin-top: 20px;">
  <tr style="border: none;">
    <td style="padding: 0 20px 3px 0; vertical-align: top; border: none;">2021-Present</td>
    <td style="padding: 0; vertical-align: top; border: none;">
      <strong>BS in Neural Science (Honors track)</strong>, New York University Shanghai
      <ul style="margin: 3px 0; padding-left: 20px; list-style: none;">
        <li style="margin: 0;">GPA: 3.84/4.00</li>
        <li style="margin: 0;">Minor: Mathematics</li>
      </ul>
    </td>
  </tr>
</table>

## Other Training
<table style="border-collapse: collapse; width: 100%; border: none;">
  <tr style="border: none;">
    <td style="padding: 0 10px 3px 0; vertical-align: top; border: none;">2024.6-2024.8</td>
    <td style="padding: 0; vertical-align: top; border: none;">Summer Undergraduate Research Program in Neuroscience, NYU Shanghai</td>
  </tr>
  <tr style="border: none;">
    <td style="padding: 0 10px 3px 0; vertical-align: top; border: none;">2023.11-present</td>
    <td style="padding: 0; vertical-align: top; border: none;">Training Program in Computational Neuroscience, NYU</td>
  </tr>
  <tr style="border: none;">
    <td style="padding: 0 10px 3px 0; vertical-align: top; border: none;">2023.6-2023.8</td>
    <td style="padding: 0; vertical-align: top; border: none;">Amgen Scholar Program, Tsinghua University</td>
  </tr>
  <tr style="border: none;">
    <td style="padding: 0 10px 3px 0; vertical-align: top; border: none;">2023.1</td>
    <td style="padding: 0; vertical-align: top; border: none;">Computational Neuroscience Winter School, Shanghai Jiao Tong University</td>
  </tr>
  <tr style="border: none;">
    <td style="padding: 0 10px 0 0; vertical-align: top; border: none;">2022.7</td>
    <td style="padding: 0; vertical-align: top; border: none;">Neuromatch Computational Neuroscience Summer School, Virtual</td>
  </tr>
</table>

<span class='anchor' id='-beyond-academics'></span>
# 💬 Beyond Academics
In my life, I also love 🏖️travelling, 🎨drawing, 🏓pingpong, 🍳cooking, 🎭musicals and 🖋️literature!
Here are some of my favourite pics in my journeys!
<div class="gallery">
    <div class="gallery-item">
        <img src="\images\image1.JPG" alt="Image 1">
    </div>
    <div class="gallery-item">
        <img src="\images\image2.JPG" alt="Image 2">
    </div>
    <div class="gallery-item">
        <img src="\images\image3.JPG" alt="Image 3">
    </div>
    <div class="gallery-item">
        <img src="\images\image4.JPG" alt="Image 4">
    </div>
    <!-- Add more images as needed -->
</div>
