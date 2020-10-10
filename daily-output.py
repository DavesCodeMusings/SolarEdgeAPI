#!/usr/bin/env python3
#
# daily-output.py -- a sample script to fetch inverter output from SolarEdge API
# 
# (c)2020 David Horton
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
# LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
# CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
# SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
# INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
# CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
# ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.
#
import requests
import json

# Fill in the two values below.
# See https://www.solaredge.com/sites/default/files/se_monitoring_api.pdf
SITE = ""
API_KEY = ""

# Request information from API.
response = requests.get("https://monitoringapi.solaredge.com/site/{0}/overview.json?api_key={1}".format(SITE, API_KEY))

# Show energy generated today along with date code. Run this after sundown to
# get the day's total output.
if (response.status_code == 200):
  print(response.text);
  data = json.loads(response.text);
  print(data['overview']['lastUpdateTime'], data['overview']['lastDayData']['energy'])
else:
  print("Error {0} connecting to API.".format(response.status_code))
