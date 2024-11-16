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

I'm a senior from NYU Shanghai, majoring in Neuroscience (honors track) and minoring in Maths. I’m privileged to work on computational cognitive neuroscience under the mentoring of <strong style="color: #4b6aa1;"><a href="https://as.nyu.edu/faculty/weiji-ma.html" style="color: #4b6aa1; text-decoration: none;">Prof. Wei Ji Ma</a></strong>, <strong style="color: #4b6aa1;"><a href="https://shanghai.nyu.edu/academics/faculty/directory/zhong-lin-lu" style="color: #4b6aa1; text-decoration: none;">Prof. Zhong-Lin Lu</a></strong>, and <strong style="color: #4b6aa1;"><a href="https://shanghai.nyu.edu/academics/faculty/directory/xing-tian" style="color: #4b6aa1; text-decoration: none;">Prof. Xing Tian</a></strong>.

I'm interested in **how the brain processes information and makes adaptive decisions within the constraints of uncertainty and limited cognitive resources**. During my undergraduate studies, I developed a strong interest in understanding the computations and representations underlying these mechanisms. I aim to uncover how these mechanisms function, why they operate as they do, and how these understandings help people by addressing cognitive biases in decision-making and improving the cognitive resource allocation for daily tasks. In my research, I mainly use a combination of three tools: **computational models, behavioral/psychophysical experiments, and neural recordings**. 

I love interdisciplinary work and collaboration with people from different backgrounds, as innovations often come from unexpected connections and fresh ways of thinking. I particularly like borrowing cool ideas/tools from physics, mathematics, and computer science although I don’t have enough credits to take many related courses in my undergraduate. But I do enjoy learning them myself for research or in my free time for fun.

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
      <strong style="color: #4b6aa1;"><a href="https://www.sainsburywellcome.org/web/groups/erlich-lab" style="color: #4b6aa1; text-decoration: none;">Erlich Lab (PI: Jeffrey Erlich)</a></strong> (moved to UCL), NYU Shanghai<br>
      <ul style="margin: 3px 0; padding-left: 20px; list-style: none;">
        <li style="margin: 0;">Optogenetics; Single-neuron recording; Decision-making under Risk</li>
      </ul>
    </td>
  </tr>
</table>
  
## Selected Projects:
### Attention
**Information Gain Drives Human Attention in Multiple Identity Tracking (MOT) (Supervisor: Zhong-Lin Lu)**

In daily life, the human brain processes a continuous stream of dynamic visual input but is constrained by limited computational resources. To focus on important moving objects amidst overwhelming information, attention allows us to selectively prioritize relevant stimuli while filtering out distractions. For instance, during a basketball game, we concentrate on the ball's movement and ignore irrelevant details, like a passerby. This leads to a critical question: How does the brain efficiently allocate attention to track multiple objects in dynamic environments? To address this, we propose computational models based on Bayesian adaptive estimation and information gain to explain attention allocation in multiple object tracking. 

<hr style="border: 0.5px solid #f0f0f0; margin: 15px 0;">
**Object Representation Guides Attention in Visual Feature Search (Supervisor: Xing Tian)**

Visual information is selectively processed in our brain. But at what state of visual processing does attention operate is unclear and has been under debate for decades. Early selection theory argue that attention operates at the earliest stages of perception, selecting specific visual features. While late selection theory believes that attention can also act after perceptual grouping has occurred. To address this ongoing debate, we design a novel visual search paradigm using eye-tracking to provide strong empirical evidence for the late selection theory.

<hr style="border: 0.5px solid #f0f0f0; margin: 15px 0;">
### Planning
**Think-Aloud Planning: Exploring Diverse Human Planning Strategies (Supervisor: Wei Ji Ma)**

Planning is a complex cognitive process that requires mental stimulation for future scenarios. In this research, we study human planning with a game called 4-in-a-row. Unlike more complicated games like chess, 4-in-a-row offers a simpler, more accessible framework for studying planning. Previously, our lab proposed a computational cognitive model that can predict human moves in the game. To test this model and gain deeper insights for planning, we revive the traditional psychological method “think-aloud protocol”, which has been used to study how experts play chess (de Groot 1946). Our findings will help refine the existing model and provide new insights into human planning.

<em style="color: #4b6aa1;"><a href="/images/thinkaloud_poster.pdf" style="color: #4b6aa1; text-decoration: none;" target="_blank">Click here for viewing the poster</a></em>

<hr style="border: 0.5px solid #f0f0f0; margin: 15px 0;">
### Decision Making
**How do people learn to make decisions from reward history?**

This is a final project from one of my favorite courses “Decision Making” at NYU taught by <strong style="color: #4b6aa1;"><a href="https://as.nyu.edu/faculty/laurence-thomas-maloney.html" style="color: #4b6aa1; text-decoration: none;">Prof. Laurence Maloney</a></strong>.

Humans learn from the past and adjust their decision-making accordingly. According to Prospect theory, decisions are evaluated by the value function and decision weight function (distorted probability). The question is, How does the reward history influence our perception of value and/or perception of probability? To investigate this question, we design a series of experiments to play a lottery game for multiple rounds. Participants could make choices among “purchase,” “skip,” and "exit,” with an immediate outcome (whether winning the lottery or not) given after each trial. To account for the biased human performance, We develop process models based on Prospect theory and a weighted Markov decision process.


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
